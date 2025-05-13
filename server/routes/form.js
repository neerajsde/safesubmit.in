import express from "express";
const router = express.Router();

import {
    getSingleForm,
    createNewForm,
    updateForm,
    deleteForm,
    getAllForms
} from '../controllers/Form.js';

import {
    auth
} from "../middleware/Auth.js";
import decrypt from "../middleware/Decrypt.js";

// forms emails handlers
import {
    addEmail,
    emailNotification,
    deleteEmail
} from '../controllers/FormEmails.js';

router.get('/', auth, getAllForms);
router.get('/:formId', auth, getSingleForm);
router.post('/', auth, decrypt, createNewForm);
router.put('/:formId', auth, decrypt, updateForm);
router.delete('/:formId', auth, deleteForm);

// fomr emails routes
router.post('/:formId/emails', auth, addEmail);
router.put('/:formId/emails/:emailId/notification', auth, emailNotification);
router.delete('/:formId/emails/:emailId', auth, deleteEmail);

export default router;