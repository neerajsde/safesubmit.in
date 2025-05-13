import express from "express";
const router = express.Router();

import {
    loginHandler,
    logOut, 
} from "../controllers/login.js";

import {
    sendOtp
} from "../controllers/signup.js";

// Middlewares 
import {
    auth
} from "../middleware/Auth.js"
import decrypt from "../middleware/Decrypt.js";
import resSender from "../utils/resSender.js";

router.post("/login", decrypt, loginHandler);
router.post("/sendotp", decrypt, sendOtp);
router.get("/logout", auth, logOut);
router.get("/dashboard", auth, (req, res) => {
    return resSender(res, 200, true,"Verified", {user: req.user});
});

export default router;