import express from "express";
const router = express.Router();

import {
    verifyRequest
} from "../middleware/Auth.js";

import {
    formSubmission
} from "../controllers/FormSubmission.js";

router.post("/form-submission", verifyRequest, formSubmission);

export default router;