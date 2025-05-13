import resSender from '../utils/resSender.js';
import { execQuery } from '../config/database.js';
import bcrypt from 'bcryptjs';
import mailSender from '../utils/mailSender.js';
import updatePasswordMail from '../mails/templates/updatePassword.js';
import jwt from 'jsonwebtoken';
import {redisClient} from '../config/redis.js';
import dotenv from 'dotenv';
dotenv.config();

export async function loginHandler(req, res){
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return resSender(res, 400, false, 'Email and password are required');
        }

        // Fetch user from the database
        const user = await execQuery(
            `SELECT id, email, password, active FROM users WHERE email = ?`, 
            [email]
        );

        if (!user.length) {
            return resSender(res, 404, false, 'user not found');
        }

        const userData = user[0];

        // Check if user is blocked
        if (!userData.active) {
            return resSender(res, 403, false, 'Your account is blocked. Please contacts our team');
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, userData.password);
        if (!isPasswordValid) {
            return resSender(res, 401, false, 'wrong password' );
        }

        // Generate JWT token
        const payload = { id: userData.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10d' });

        await redisClient.setEx(`user:${userData.id}:token`, 864000, String(token));
        
        return resSender(res, 200, true, 'Login successful', {user_id: userData.id, token});
    } catch (err) {
        console.error('Login Error:', err.message);
        return resSender(res, 500, false, err.message);
    }
};

export async function changePassword(req, res) {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return resSender(res, 400, false, 'All fields are required');
        }

        // Fetch user details
        const [userData] = await execQuery(
            `SELECT id, name, email, password FROM users WHERE id = ?`, 
            [req.user.id]
        );

        if (!userData) {
            return resSender(res, 404, false, 'User not found');
        }

        // Validate old password
        const isPasswordValid = await bcrypt.compare(oldPassword, userData.password);
        if (!isPasswordValid) {
            return resSender(res, 401, false, 'Incorrect old password');
        }

        // Hash new password and update user
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await execQuery(`UPDATE users SET password = ? WHERE id = ?`, [hashedPassword, userData.id]);

        // Send email notification (async, does not block response)
        mailSender(userData.email, 'Changed Password', updatePasswordMail(userData.name)).catch(console.error);

        return resSender(res, 200, true, 'Password updated successfully');
    } catch (err) {
        console.error('Change Password Error:', err.message);
        return resSender(res, 500, false, 'Internal Server Error');
    }
}

export async function logOut(req, res) {
    try {
        if (!req.user || !req.user.id) {
            return resSender(res, 400, false, "Invalid request, user not found");
        }

        const token = req.headers["authorization"]?.split(' ')[1];
        if (!token) {
            return resSender(res, 401, false, "Token is missing");
        }
        
        // Decode token to get expiration time
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.exp) {
            return resSender(res, 400, false, "Invalid token");
        }

        // 1. Immediately remove the stored token from Redis (Recommended)
        redisClient.del(`authToken:${req.user.id}`);

        // 2. Optional: Blacklist the token with an expiry (alternative method)
        const expTime = decoded.exp - Math.floor(Date.now() / 1000);
        if (expTime > 0) {
            redisClient.set(`expToken:${token}`, "blacklisted", "EX", expTime);
        }

        return resSender(res, 200, true, "Logout successful");
    } catch (err) {
        console.error("Logout Error:", err.message);
        return resSender(res, 500, false, "An error occurred during logout");
    }
};

