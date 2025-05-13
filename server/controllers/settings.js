import resSender from '../utils/resSender.js';
import { execQuery } from '../config/database.js';
import { validateEmail, validatePassword }  from '../utils/validation.js';
import mailSender from '../utils/mailSender.js';
import sendResetPasswordMail from '../mails/templates/sendResetPasswordMail.js';
import {redisClient} from '../config/redis.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dotenv from 'dotenv'
dotenv.config();

export async function getSettings(req, res){
    try{
        let userId = req.user.id;

        if(!userId){
            return resSender(res, 400, "User ID is required", "User ID is required");
        }

        let [userData] = await execQuery("SELECT id as userId, api_key FROM users WHERE id = ?", [userId]);
        if(!userData){
            return resSender(res, 404, "User not found", "User not found");
        }

        return resSender(res, 200, "Settings retrieved successfully", userData);
    } catch(err){
        console.log("Error when getting settings: ", err.message);
        resSender(res, 500, "Error when getting settings", err.message);
    }
}

export async function resetTokenProvider(req, res){
    try{
        const { email } = req.query;
        if(!email){
            return resSender(res, 400, false, 'email is required');
        }
        if(!validateEmail(email)){
            return resSender(res, 400, false, 'invaild email id');
        }

        // unessery reset token reset
        let checkToken = await redisClient.get(`reset-password-email:${email}`);
        if(checkToken){
            return resSender(res, 401, false, 'You have already reset token please try again later');
        }

        let [user] = await execQuery(
            'SELECT id, name, active, approve FROM users where email = ?', [email]
        )
        if(!user){
            return resSender(res, 404, false, 'user not found');
        }
        if(!user.active){
            return resSender(res, 401, false, 'your account is inactive');
        }
        if(!user.approve){
            return resSender(res, 401, false, 'your account is blocked');
        }

        let resetToken = crypto.randomBytes(32).toString('hex');
        let url = `${process.env.FRONTEND_URL}/forgot-password?resetToken=${resetToken}`;

        await mailSender(
            email.trim(),
            `Reset Password - ${process.env.APP_NAME}`,
            sendResetPasswordMail(user.name.trim().split(' ').at(0), url)
        );

        await redisClient.setEx(`reset-password:${resetToken}`, 300, String(email));
        await redisClient.setEx(`reset-password-email:${email}`, 300, String(email));
        return resSender(res, 200, true, 'mail sent successful');
    } catch(err){
        console.log("Error while reset token: ", err.message);
        return resSender(res, 500, false, 'Internal server error', err.message);
    }
}

export async function resetPassword(req, res) {
    try{
        const {resetToken} = req.query;
        const {email, password} = req.body;
        if(!resetToken){
            return resSender(res, 401, false, 'reset token is required');
        }
        if(!email){
            return resSender(res, 400, false, 'email is required');
        }
        if(!validateEmail(email)){
            return resSender(res, 400, false, 'invaild email id');
        }
        if(!password){
            return resSender(res, 401, false, 'password is required');
        }

        let checkToken = await redisClient.get(`reset-password:${resetToken}`);
        if(!checkToken){
            return resSender(res, 401, false, 'Token has expired');
        }
        if(checkToken !== email){
            return resSender(res, 401, false, 'Wrong email');
        }

        let vaildPassword = validatePassword(password);
        if(vaildPassword !== true){
            return resSender(res, 401, false, vaildPassword);
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        let update = await execQuery(
            'UPDATE users SET password = ?  WHERE email = ?',
            [hashedPassword, email]
        );
        if (update.affectedRows === 0) {
            return resSender(res, 500, false, 'Failed to update password');
        }
        await redisClient.expire(`reset-password:${resetToken}`, 0);
        await redisClient.expire(`reset-password-email:${email}`);

        return resSender(res, 200, true, 'Password updated sucessfully');
    }  catch(err){
        console.log("Error while reset password: ", err.message);
        return resSender(res, 500, false, 'Internal server error', err.message);
    }
}