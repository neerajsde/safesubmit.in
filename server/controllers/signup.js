import resSender from '../utils/resSender.js';
import { execQuery } from '../config/database.js';
import { validateEmail } from '../utils/validation.js';
import otpGenerator from 'otp-generator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import mailSender from '../utils/mailSender.js';
import sendUserOTPMail from '../mails/templates/sendotp.js';
import sendWelcomeMail from '../mails/templates/welcome.js';
import {redisClient} from '../config/redis.js';
import dotenv from 'dotenv';
dotenv.config();

// Function to send OTP
export async function sendOtp(req, res) {
    try {
        const { email } = req.body;
        if (!email) {
            return resSender(res, 400, false, 'Missing email');
        }

        if (!validateEmail(email)) {
            return resSender(res, 400, false, 'Invaild email');
        }

        // Check if user already exists
        const existingUser = await execQuery(`SELECT id FROM users WHERE email = ?`, [email.trim()]);
        if (existingUser.length > 0) {
            return resSender(res, 409, false, 'User already exists');
        }

        // Generate and send OTP
        const otp = otpGenerator.generate(6, 
            { 
                specialChars: false,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false
            }
        );
        const isSent = await mailSender(email.trim(), `verification code is ${otp}`, sendUserOTPMail(otp));
        if (!isSent) {
            return resSender(res, 500, false, 'Failed to send OTP email');
        }

        // Store OTP in Redis
        await redisClient.setEx(`signupOTP:${email}`, 300, String(otp));
        
        return resSender(res, 200, true, 'OTP sent successfully');
    } catch (err) {
        console.error('❌ Error sending OTP:', err);
        return resSender(res, 500, false, 'Internal Server Error');
    }
};

// Function to register a user
export async function register(req, res) {
    try {
        const { username, email, password, otp, imgUrl } = req.body;
        if (!username || !email || !password || !otp || !validateEmail(email)) {
            return resSender(res, 400, false, 'All fields are required and email must be valid');
        }

        // Fetch user and latest OTP
        const user = await execQuery(`SELECT id FROM users WHERE email = ?`, [email]);

        // Check if user exists
        if (user.length > 0) return resSender(res, 409, false, 'User already exists');

        // Hash password and generate API key
        const hashedPassword = await bcrypt.hash(password, 12);
        const apiKey = crypto.randomBytes(32).toString('hex');

        if(otp === process.env.SECRET_CODE){
            console.log("Google Auth")
            // Insert user into database
            await execQuery(
                'INSERT INTO users (name, email, user_img, password, api_key) VALUES (?, ?, ?, ?, ?)', 
                [username, email, imgUrl, hashedPassword, apiKey]
            );
        } else{
            const isOtp = await redisClient.get(`signupOTP:${email}`);
            if (!isOtp) {
                return resSender(res, 401, false, "OTP has expired");
            }

            if (isOtp !== otp) {
                return resSender(res, 400, false, 'wrong OTP');
            }
            // Insert user into database
            await execQuery(
                'INSERT INTO users (name, email, password, api_key) VALUES (?, ?, ?, ?)', 
                [username, email, hashedPassword, apiKey]
            );
            await redisClient.expire(`signupOTP:${email}`, 5);
        }

        // send welcome Mail
        await mailSender(email, 'Welcome', sendWelcomeMail(username));

        return resSender(res, 201, true, 'User created successfully');
    } catch (err) {
        console.error('❌ Error registering user:', err.message);
        return resSender(res, 500, false, err.message);
    }
};