import { execQuery } from '../config/database.js';
import { validateEmail } from '../utils/validation.js';
import mailSender from '../utils/mailSender.js';
import sendUserThankYouMail from '../mails/client/sendUserThankYouMail.js';
import sendAdminNotificationMail from '../mails/templates/sendAdminNotificationMail.js';
import { fileUpload } from '../utils/fileUploader.js'
import dotenv from 'dotenv';
dotenv.config();

export async function formSubmission(req, res) {
    try {
        const { id, name: formName, form_schema, activeEmails } = req.form;
        if (!id){
            return res.status(400).json({ success: false, message: 'Invalid Form ID' });
        }

        // Validate fields and set defaults
        const FieldsArr = JSON.parse(form_schema);
        let most_data = [];
        let dummy_data = {};
        for (const field of FieldsArr) {
            const { required, field_name, type } = field;
            if(field.type === 'file'){
                let file_anything = req.files?.[field_name];
                if(file_anything){
                    let upload = await fileUpload('files', file_anything);
                    if(upload.flag){
                        most_data.push(upload.url);
                        dummy_data[field_name] = upload.url;
                    }
                    else{
                        return res.status(500).json({success: false, message: upload.message || 'File uploading error'})
                    }
                }
                else{
                    return res.status(400).json({ success: false, message: `Please upload the '${field_name}'.` });
                }
            }
            else{
                const value = req.body[field_name] || '';
                most_data.push(value);
                dummy_data[field_name] = value;
                if (required && !value.trim() && type !== 'file') {
                    return res.status(400).json({ success: false, message: `Please fill the '${field_name}' field` });
                }
                req.body[field_name] = value;
            }
        }

        // Database insertion
        const submission = await execQuery(
            'INSERT INTO form_data (form_id, submitted_data) VALUES (?, ?)',
            [id, JSON.stringify(most_data)]
        );
        
        if (submission.affectedRows === 0) {
            return res.status(500).json({ success: false, message: 'Failed to store submission' });
        }

        const submissionId = submission.insertId;
        const formLink = `${process.env.FRONTEND_URL}/form/${id}/submission/${submissionId}`;
        const emailPromises = [];

        // Prepare admin notifications
        if (Array.isArray(activeEmails) && activeEmails.length > 0) {
            const htmlAdmin = sendAdminNotificationMail({
                formName,
                formLink,
                formData: JSON.stringify(dummy_data)
            });
            
            activeEmails
                .filter(email => validateEmail(email))
                .forEach(email => {
                    emailPromises.push(mailSender(
                        email,
                        `New Submission Received - ${formName}`,
                        htmlAdmin
                    ));
                });
        }

        // Prepare user confirmation
        const userEmail = req.body.email;
        const userName = req.body.name || req.body.username;
        if (userEmail && userName && validateEmail(userEmail)) {
            emailPromises.push(mailSender(
                userEmail,
                `Thank you for your submission - ${formName}`,
                sendUserThankYouMail({ userName, formName })
            ));
        }

        // Execute all email operations in parallel
        await Promise.all(emailPromises);

        // send success response
        return res.status(200).json({
            success: true,
            message: 'Form submitted successfully'
        });
    } catch (err) {
        console.error('Form submission error:', err.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
}