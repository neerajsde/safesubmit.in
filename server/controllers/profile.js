import resSender from '../utils/resSender.js';
import { execQuery } from '../config/database.js';
import { imageUploader, deleteFile } from '../utils/fileUploader.js';
import {
    formatDateToReadable,
    convertTimeTo12HourFormat
} from '../utils/converter.js';

export async function getProfile(req, res) {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return resSender(res, 400, false, "User ID is required", "User ID is required");
        }

        const [userData] = await execQuery(
            "SELECT id, name, email, active, approve, country_code, phone, date, time, user_img FROM users WHERE id = ?",
            [userId]
        );

        if (!userData) {
            return resSender(res, 404, false, "User not found");
        }

        const formattedUser = {
            ...userData,
            date: formatDateToReadable(userData.date),
            time: convertTimeTo12HourFormat(userData.time),
        };

        return resSender(res, 200, true, "Profile retrieved successfully", formattedUser);
    } catch (err) {
        console.error("Error when getting profile:", err.message);
        return resSender(res, 500, false, "Error when getting profile", err.message);
    }
}

export async function updateProfile(req, res) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return resSender(res, 400, false, "User ID is required");
    }

    const { name, phone, country_code } = req.body;
    const imgFile = req.files?.userImg;

    if (!name || !phone || !country_code) {
      return resSender(res, 400, false, "All fields except image are required");
    }

    let imageUrl = null;

    // If image is provided, upload it first
    if (imgFile) {
      let [userImage] = await execQuery(
        'SELECT user_img FROM users WHERE id = ?',
        [userId]
      );
      if(userImage && userImage.user_img) {
        const fileName = userImage.user_img.split('/').pop();
        await deleteFile('user_images', fileName);
      }
      const uploadResult = await imageUploader('user_images', imgFile, {
        width: 300,
        height: 300,
        quality: 80
      });

      if (!uploadResult.flag) {
        return resSender(res, 400, false, uploadResult.message);
      }

      imageUrl = uploadResult.url;
    }

    // Build SQL update statement dynamically
    const updateFields = [];
    const values = [];

    updateFields.push("name = ?", "phone = ?", "country_code = ?");
    values.push(name, phone, country_code);

    if (imageUrl) {
      updateFields.push("user_img = ?");
      values.push(imageUrl);
    }

    values.push(userId); // For WHERE clause

    const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;

    await execQuery(updateQuery, values);

    return resSender(res, 200, true, "Profile updated successfully", imageUrl ? { user_img: imageUrl } : null);

  } catch (err) {
    console.error("Update error:", err.message);
    return resSender(res, 500, false, "Internal server error", err.message);
  }
}

