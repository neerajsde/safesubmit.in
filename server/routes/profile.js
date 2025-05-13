import express from 'express';
let router = express.Router();

import {
    getProfile,
    updateProfile
} from '../controllers/profile.js';

import {
    auth
} from '../middleware/Auth.js';

// Route to get settings
router.get('/', auth, getProfile);
router.put('/', auth, updateProfile);

export default router;