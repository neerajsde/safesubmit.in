import express from 'express'
let router = express.Router();

import {
    sendFile
} from '../controllers/files.js';

import {
    auth
} from "../middleware/Auth.js"


router.get('/', auth, sendFile);

export default router;