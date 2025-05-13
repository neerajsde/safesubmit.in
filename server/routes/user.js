import express from "express";
const router = express.Router();

import {
    register
} from "../controllers/signup.js";

import {
    changePassword
} from "../controllers/login.js";

import {
    auth
} from "../middleware/Auth.js"

// contact us controller
import {
    contactUs
} from "../controllers/contact.js";

import decrypt from "../middleware/Decrypt.js";

router.post("/", decrypt, register);
router.put("/password", auth, decrypt, changePassword);
router.post("/contact", decrypt, contactUs);

export default router;