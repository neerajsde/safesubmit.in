import jwt from "jsonwebtoken";
import resSender from "../utils/resSender.js";
import dotenv from "dotenv";
import { redisClient } from "../config/redis.js";
import { execQuery } from "../config/database.js";
dotenv.config();

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return resSender(res, 401, false, "Authorization token is missing");
    }

    // Check for blacklisted token & verify JWT
    const [isBlacklisted, payload] = await Promise.all([
      redisClient.get(`expToken:${token}`),
      new Promise((resolve, reject) =>
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) =>
          err ? reject(err) : resolve(decoded)
        )
      ),
    ]);

    if (isBlacklisted) {
      return resSender(
        res,
        401,
        false,
        "Token has been blacklisted. Please log in again."
      );
    }

    const userId = payload.id;

    // Ensure the token is the latest one issued to the user
    const storedToken = await redisClient.get(`user:${userId}:token`);
    if (storedToken !== token) {
      return resSender(
        res,
        401,
        false,
        "Invalid or expired session. Please log in again."
      );
    }

    // Try to get cached user data
    const [name, email, user_img] = await Promise.all([
      redisClient.get(`user:${userId}:name`),
      redisClient.get(`user:${userId}:email`),
      redisClient.get(`user:${userId}:user_img`),
    ]);

    if (name && email && user_img) {
      req.user = { id: userId, name, email, user_img };
      return next();
    }

    // If not cached, fetch from DB
    const [user] = await execQuery(
      "SELECT email, name, user_img, active FROM users WHERE id = ?",
      [userId]
    );

    if (!user) {
      return resSender(res, 404, false, "User not found");
    }

    if (!user.active) {
      return resSender(res, 401, false, "User account is not active");
    }

    // Cache fetched user details
    await Promise.all([
      redisClient.setEx(`user:${userId}:name`, 300, String(user.name)),
      redisClient.setEx(`user:${userId}:email`, 300, String(user.email)),
      redisClient.setEx(
        `user:${userId}:user_img`,
        300,
        String(user.user_img) || ""
      ),
    ]);

    req.user = {
      id: userId,
      name: user.name,
      email: user.email,
      user_img: user.user_img,
    };

    next();
  } catch (err) {
    console.error("Authentication Error:", err);

    if (err.name === "TokenExpiredError") {
      return resSender(res, 401, false, "Token has expired!");
    }

    return resSender(res, 500, false, "Internal Server Error", {
      message: err.message,
    });
  }
};

export async function verifyRequest(req, res, next) {
  try {
    const apiKey = req.headers["x-api-key"];
    const formKey = req.headers["x-form-key"];

    if (!apiKey || !formKey) {
      return res.status(400).json({
        success: false,
        message: "API key and Form key are required",
      });
    }

    if (typeof apiKey !== "string" || typeof formKey !== "string") {
      return res.status(400).json({
        success: false,
        message: "API key and Form key must be strings",
      });
    }

    const userIP =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    const submission_count_key = `form_submission_count:${userIP}`;

    let count = await redisClient.get(submission_count_key);
    count = parseInt(count) || 0;

    if (count >= 3) {
      return res.status(400).json({
        success: false,
        message: "You have submitted the form already",
      });
    }

    if (count === 0) {
      await redisClient.setEx(submission_count_key, 300, "1");
    } else {
      await redisClient.incr(submission_count_key);
    }

    const ttl = 5 * 60 * 60; // 5 hours
    let userId;

    const cachedApiKey = await redisClient.get(`authAPIKeys:${apiKey}`);
    if (cachedApiKey) {
      userId = await redisClient.get(`authAPIKeys:${apiKey}:id`);
    } else {
      const [user] = await execQuery(
        "SELECT id, active, approve FROM users WHERE api_key = ?",
        [apiKey]
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Invalid API Key",
        });
      }
      if (!user.active) {
        return res.status(401).json({
          success: false,
          message: "API key is not active",
        });
      }
      if (!user.approve) {
        return res.status(401).json({
          success: false,
          message: "API key is not approved",
        });
      }

      userId = String(user.id);
      await redisClient.setEx(`authAPIKeys:${apiKey}`, ttl, "true");
      await redisClient.setEx(`authAPIKeys:${apiKey}:id`, ttl, userId);
    }

    const [cachedFormId, cachedFormName, cachedFormSchema, cachedFormEmails] =
      await Promise.all([
        redisClient.get(`authKeys:${formKey}:id`),
        redisClient.get(`authKeys:${formKey}:name`),
        redisClient.get(`authKeys:${formKey}:form_schema`),
        redisClient.get(`authKeys:${formKey}:formActiveEmails`),
      ]);

    if (
      cachedFormId &&
      cachedFormName &&
      cachedFormSchema &&
      cachedFormEmails
    ) {
      req.form = {
        id: cachedFormId,
        name: cachedFormName,
        form_schema: cachedFormSchema,
        activeEmails: JSON.parse(cachedFormEmails),
      };
      return next();
    }

    const [form] = await execQuery(
      "SELECT id, name, active, form_schema FROM forms WHERE keyId = ? AND userId = ?",
      [formKey, userId]
    );

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Invalid Form Key",
      });
    }
    if (!form.active) {
      return res.status(401).json({
        success: false,
        message: "Form key is not active",
      });
    }

    const formEmails = await execQuery(
      "SELECT email FROM form_emails WHERE formId = ? AND active = 1",
      [form.id]
    );
    const emailList = formEmails.map((f) => f.email);

    await Promise.all([
      redisClient.setEx(`authKeys:${formKey}:id`, ttl, String(form.id)),
      redisClient.setEx(`authKeys:${formKey}:name`, ttl, String(form.name)),
      redisClient.setEx(
        `authKeys:${formKey}:form_schema`,
        ttl,
        typeof form.form_schema === "string"
          ? form.form_schema
          : JSON.stringify(form.form_schema)
      ),
      redisClient.setEx(
        `authKeys:${formKey}:formActiveEmails`,
        ttl,
        JSON.stringify(emailList)
      ),
    ]);

    req.form = {
      id: String(form.id),
      name: form.name,
      form_schema:
        typeof form.form_schema === "string"
          ? form.form_schema
          : JSON.stringify(form.form_schema),
      activeEmails: emailList,
    };

    return next();
  } catch (err) {
    console.error("Error in verifyRequest middleware:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
}
