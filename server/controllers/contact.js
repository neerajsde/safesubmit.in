import resSender from '../utils/resSender.js';
import { execQuery } from '../config/database.js';
import { redisClient } from '../config/redis.js';
import { validateEmail } from '../utils/validation.js';
import mailSender from '../utils/mailSender.js';
import notifySupportTeamMail from '../mails/templates/suportTeamMail.js';
import sendContactConfirmationMail from '../mails/templates/contactUs.js';
import dotenv from 'dotenv';
dotenv.config();

export async function contactUs(req, res) {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return resSender(res, 400, false, 'All fields are required');
        }

        if (!validateEmail(email)) {
            return resSender(res, 400, false, 'Invalid email Id');
        }

        const redisKey = `contacts:${email}`;
        const alreadyExists = await redisClient.get(redisKey);
        if (alreadyExists) {
            return resSender(res, 302, false, 'You have already submitted.');
        }
        
        const ttlInSeconds = 2 * 60 * 60; // 2 hours
        const query = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';
        const values = [name, email, message];

        await execQuery(query, values);
        redisClient.setEx(redisKey, ttlInSeconds, email);
        mailSender(
            email,
            `Thank you for contacting ${process.env.APP_NAME}`,
            sendContactConfirmationMail(name)
        );

        mailSender(
            process.env.CUSTOMER_SUPPORT_EMAIL,
            `New Query '${process.env.APP_NAME}' - ${name}`,
            notifySupportTeamMail(name, email, message)
        );

        return resSender(res, 201, true, 'Contact message sent successfully');
    } catch (error) {
        console.error('Error in newContact:', error);
        return resSender(res, 500, false, 'Internal server error', error.message);
    }
}