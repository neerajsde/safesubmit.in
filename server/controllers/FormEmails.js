import resSender from '../utils/resSender.js';
import { execQuery } from '../config/database.js';

export async function addEmail(req, res) {
    try{
        const { formId } = req.params;
        const userId = req.user.id;
        const { email } = req.body;

        // Input validation
        if (!formId) {
            return resSender(res, 400, false, 'Invalid Form ID');
        }
        if (!userId || typeof userId !== 'number') {
            return resSender(res, 400, false, 'Invalid User ID');
        }
        if (!email || typeof email !== 'string' || !email.trim()) {
            return resSender(res, 400, false, 'Please enter a valid email address');
        }

        // Check if the form exists
        const form = await execQuery('SELECT id FROM forms WHERE id = ? AND userId = ?', [formId, userId]);
        if (form.length === 0) {
            return resSender(res, 404, false, 'Form not found');
        }

        // Check if the email already exists in the form
        const existingEmail = await execQuery('SELECT id FROM form_emails WHERE formId = ? AND email = ?', [formId, email]);
        if (existingEmail.length > 0) {
            return resSender(res, 409, false, `Email '${email}' already exists in the form`);
        }

        // Insert the new email into the database
        const query = await execQuery(
            'INSERT INTO form_emails (formId, email) VALUES (?, ?)',
            [formId, email.trim()]
        );

        if (query.affectedRows === 0) {
            return resSender(res, 500, false, 'Failed to add email to form');
        }

        return resSender(res, 200, true, 'Email added successfully', { email: email.trim() });
    } catch (err) {
            console.error('Error while adding form new email:', err.message);
            return resSender(res, 500, false, 'Internal server error');
    }
}

export async function emailNotification(req, res) {
    try{
        const { formId, emailId } = req.params;
        const userId = req.user.id;

        // Input validation
        if (!formId) {
            return resSender(res, 400, false, 'Invalid Form ID');
        }
        if (!userId || typeof userId !== 'number') {
            return resSender(res, 400, false, 'Invalid User ID');
        }
        if (!emailId) {
            return resSender(res, 400, false, 'Invalid Email ID');
        }

        // Check if the form exists
        const form = await execQuery('SELECT id FROM forms WHERE id = ? AND userId = ?', [formId, userId]);
        if (form.length === 0) {
            return resSender(res, 404, false, 'Form not found');
        }

        // Check if the email exists in the form
        const existingEmail = await execQuery('SELECT id FROM form_emails WHERE formId = ? AND email = ?', [formId, emailId]);
        if (existingEmail.length === 0) {
            return resSender(res, 404, false, 'Email not found in the form');
        }

        // Update the email notification status in the database
        const query = await execQuery('UPDATE form_emails SET active = NOT active WHERE formId = ? AND email = ?', [formId, emailId]);
        if (query.affectedRows === 0) {
            return resSender(res, 500, false, 'Failed to update email notification status');
        }

        let emailInfo = await execQuery('SELECT * FROM form_emails WHERE formId = ? AND email = ?', [formId, emailId]);
        if (emailInfo.length === 0) {
            return resSender(res, 404, false, 'Email not found in the form');
        }   
        let emailStatus = emailInfo[0].active ? 'enabled' : 'disabled';

        return resSender(res, 200, true, 'Email notification status updated.', { emailId, emailStatus });
    } catch (err) {
            console.error('Error while updating form email notification status:', err.message);
            return resSender(res, 500, false, 'Internal server error');
    }
}

export async function deleteEmail(req, res) {
    try{
        const { formId, emailId } = req.params;
        const userId = req.user.id;

        // Input validation
        if (!formId) {
            return resSender(res, 400, false, 'Invalid Form ID');
        }
        if (!userId || typeof userId !== 'number') {
            return resSender(res, 400, false, 'Invalid User ID');
        }
        if (!emailId) {
            return resSender(res, 400, false, 'Invalid Email ID');
        }

        // Check if the form exists
        const form = await execQuery('SELECT id FROM forms WHERE id = ? AND userId = ?', [formId, userId]);
        if (form.length === 0) {
            return resSender(res, 404, false, 'Form not found');
        }

        // Check if the email exists in the form
        const existingEmail = await execQuery('SELECT id FROM form_emails WHERE formId = ? AND email = ?', [formId, emailId]);
        if (existingEmail.length === 0) {
            return resSender(res, 404, false, 'Email not found in the form');
        }

        // Delete the email from the database
        const query = await execQuery('DELETE FROM form_emails WHERE formId = ? AND email = ?', [formId, emailId]);

        if (query.affectedRows === 0) {
            return resSender(res, 500, false, 'Failed to delete email from form');
        }

        return resSender(res, 200, true, 'Email deleted successfully', { emailId });
    } catch (err) {
            console.error('Error while deleting form email:', err.message);
            return resSender(res, 500, false, 'Internal server error');
    }
}