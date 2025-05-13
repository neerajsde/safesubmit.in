import express from 'express';
let router = express.Router();

import {
    getSettings,
    resetTokenProvider,
    resetPassword
} from '../controllers/settings.js';

import {
    auth
} from '../middleware/Auth.js';
import decrypt from "../middleware/Decrypt.js";

// Route to get settings
router.get('/', auth, getSettings);
router.get('/reset-password', decrypt, resetTokenProvider);
router.put('/reset-password', decrypt, resetPassword);

export default router;