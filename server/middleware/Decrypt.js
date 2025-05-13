import { decrypt } from "../utils/parse.js";

export default async function decryptData(req, res, next) {
    try {
        if (!req.body || typeof req.body !== "object" || Object.keys(req.body).length === 0) {
            return next(); // Skip decryption if request body is empty or not an object
        }

        try {
            req.body = decrypt(req.body); // Decrypt and replace request body
            next();
        } catch (error) {
            console.error("Decryption failed:", error.message);
            res.status(400).json({ success: false, error: "Invalid encrypted data" });
        }
    } catch (error) {
        console.error("Error in decryptData middleware:", error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}
