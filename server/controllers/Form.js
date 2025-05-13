import resSender from '../utils/resSender.js';
import { execQuery } from '../config/database.js';
import otpGenerator from 'otp-generator';
import {
    formatDateToReadable,
    convertTimeTo12HourFormat
} from '../utils/converter.js';

export async function getSingleForm(req, res) {
  try {
    const {formId} = req.params;
    const userId = req.user?.id;

    if (!formId || isNaN(formId)) {
      return resSender(res, 400, false, 'Invalid form ID');
    }

    // Get form basic details
    const formResult = await execQuery(
      'SELECT id, keyId, name, form_schema FROM forms WHERE id = ? AND userId = ?',
      [formId, userId]
    );

    if (formResult.length === 0) {
      return resSender(res, 404, false, 'Form not found or unauthorized access');
    }

    const form = formResult[0];
    const schema = JSON.parse(form.form_schema);

    // Get associated emails
    const emailResult = await execQuery(
      'SELECT id, email FROM form_emails WHERE formId = ?',
      [formId]
    );

    let submitedData = [];
    submitedData = await execQuery(
      'SELECT * FROM form_data WHERE form_id = ? ORDER BY created_date DESC, created_time DESC',
      [formId]
    )
    if(submitedData.length > 0) {
      submitedData = submitedData.map((data) => {
        return {
          ...data,
          created_date: formatDateToReadable(data.created_date),
          created_time: convertTimeTo12HourFormat(data.created_time)
        };
      });
    }

    return resSender(res, 200, true, 'Form fetched successfully', {
      id: form.id,
      keyId: form.keyId,
      name: form.name,
      schema,
      emails: emailResult,
      submitedData
    });
  } catch (err) {
    console.error('Get Single Form Error:', err.message);
    return resSender(res, 500, false, 'Internal server error');
  }
}

export async function createNewForm(req, res) {
    try {
        const { name, schema = [], emails = [] } = req.body;
        const userId = req.user?.id;

        if (typeof name !== 'string' || !name.trim()) {
            return resSender(res, 400, false, 'Please enter a valid form name');
        }

        if (!Array.isArray(schema) || schema.length === 0) {
            return resSender(res, 400, false, 'Please enter a valid form schema');
        }

        // Check if form with same name exists
        const existing = await execQuery(
            'SELECT id FROM forms WHERE name = ? AND userId = ?',
            [name.trim(), userId]
        );
        if (existing.length > 0) {
            return resSender(res, 409, false, `Form with name '${name.trim()}' already exists`);
        }

        const keyId = otpGenerator.generate(25, { specialChars: false });
        const insertForm = await execQuery(
            'INSERT INTO forms (keyId, userId, name, form_schema) VALUES (?, ?, ?, ?)',
            [keyId, userId, name.trim(), JSON.stringify(schema)]
        );

        if (insertForm.affectedRows === 0) {
            return resSender(res, 500, false, 'Failed to create form');
        }

        const formId = insertForm.insertId;

        // Filter valid emails and insert them in parallel
        const emailInserts = emails
            .filter(({ email }) => typeof email === 'string' && email.trim())
            .map(({ email }) =>
                execQuery('INSERT INTO form_emails (formId, email) VALUES (?, ?)', [formId, email.trim()])
            );

        await Promise.all(emailInserts);

        return resSender(res, 201, true, 'Form created successfully');
    } catch (err) {
        console.error('New Form Creation Error:', err.message);
        return resSender(res, 500, false, 'Internal server error');
    }
}

export async function updateForm(req, res) {
    try {
      const { name, schema = [], emails = [] } = req.body;
      const {formId} = req.params;
      const userId = req.user?.id;
  
      if (!formId || isNaN(formId)) {
        return resSender(res, 400, false, 'Invalid form ID');
      }
  
      if (typeof name !== 'string' || !name.trim()) {
        return resSender(res, 400, false, 'Please enter a valid form name');
      }
  
      if (!Array.isArray(schema) || schema.length === 0) {
        return resSender(res, 400, false, 'Please enter a valid form schema');
      }
  
      // Check if the form exists and belongs to the current user
      const existing = await execQuery(
        'SELECT id FROM forms WHERE id = ? AND userId = ?',
        [formId, userId]
      );
  
      if (existing.length === 0) {
        return resSender(res, 404, false, 'Form not found or unauthorized access');
      }
  
      // Check if form name already exists for the same user (and is not this form)
      const duplicate = await execQuery(
        'SELECT id FROM forms WHERE name = ? AND userId = ? AND id != ?',
        [name.trim(), userId, formId]
      );
  
      if (duplicate.length > 0) {
        return resSender(res, 409, false, `Form with name '${name.trim()}' already exists`);
      }
  
      // Update form name and schema
      const updateResult = await execQuery(
        'UPDATE forms SET name = ?, form_schema = ? WHERE id = ?',
        [name.trim(), JSON.stringify(schema), formId]
      );
  
      if (updateResult.affectedRows === 0) {
        return resSender(res, 500, false, 'Failed to update form');
      }
  
      // Delete existing emails
      await execQuery('DELETE FROM form_emails WHERE formId = ?', [formId]);
  
      // Insert updated emails
      const emailInserts = emails
        .filter(({ email }) => typeof email === 'string' && email.trim())
        .map(({ email }) =>
          execQuery('INSERT INTO form_emails (formId, email) VALUES (?, ?)', [formId, email.trim()])
        );
  
      await Promise.all(emailInserts);
  
      return resSender(res, 200, true, 'Form updated successfully');
    } catch (err) {
      console.error('Form Update Error:', err.message);
      return resSender(res, 500, false, 'Internal server error');
    }
}  

export async function deleteForm(req, res) {
    try {
        const { formId } = req.params;
        const userId = req.user.id;

        // Input validation
        if (!formId) {
            return resSender(res, 400, false, 'Invalid Form ID');
        }
        if (!userId || typeof userId !== 'number') {
            return resSender(res, 400, false, 'Invalid User ID');
        }

        // Check if the form exists
        const form = await execQuery('SELECT id FROM forms WHERE id = ? AND userId = ?', [formId, userId]);
        if (form.length === 0) {
            return resSender(res, 404, false, 'Form not found');
        }

        // Delete the form
        const deleteQuery = await execQuery('DELETE FROM forms WHERE id = ? AND userId = ?', [formId, userId]);

        if (deleteQuery.affectedRows === 0) {
            return resSender(res, 500, false, 'Failed to delete form');
        }

        return resSender(res, 200, true, 'Form deleted successfully');
    } catch (err) {
        console.error('Form Deletion Error:', err.message);
        return resSender(res, 500, false, 'Internal server error');
    }
}

export async function getAllForms(req, res) {
    try {
      const userId = req.user.id;
  
      if (!userId || typeof userId !== 'number') {
        return resSender(res, 400, false, 'Invalid User ID');
      }
  
      const forms = await execQuery(
        `SELECT 
            f.*,
            GROUP_CONCAT(fm.email) AS emails,
            GROUP_CONCAT(fm.active) AS notifications
         FROM 
            forms f
         LEFT JOIN 
            form_emails fm ON f.id = fm.formId
         WHERE 
            f.userId = ?
         GROUP BY 
            f.id
         ORDER BY
            f.date DESC, f.time DESC`,
        [userId]
      );
  
      if (forms.length === 0) {
        return resSender(res, 404, false, 'Empty forms');
      }
  
      const parsedForms = forms.map(form => {
        const formSchema = JSON.parse(form.form_schema);
        const emails = form.emails ? form.emails.split(',') : [];
        const notifications = form.notifications ? form.notifications.split(',') : [];
  
        const emailObjects = emails.map((email, index) => ({
          email: email.trim(),
          active: notifications[index] === '1'
        }));
  
        return {
          ...form,
          form_schema: formSchema,
          date: formatDateToReadable(form.date),
          time: convertTimeTo12HourFormat(form.time),
          emails: emailObjects
        };
      });
  
      return resSender(res, 200, true, 'Found all forms', parsedForms);
    } catch (err) {
      console.error('Get Forms Error:', err.message);
      return resSender(res, 500, false, 'Internal server error');
    }
}
  