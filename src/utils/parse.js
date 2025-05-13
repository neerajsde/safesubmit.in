import crypto from 'crypto';

const IV_LENGTH = 16;
const ENCRYPTION_KEY = Buffer.from(process.env.NEXT_PUBLIC_ENCRYPTION_KEY || '', 'base64');

if (ENCRYPTION_KEY.length !== 32) {
    throw new Error('Invalid encryption key length. Must be 32 bytes.');
}

// Function to encrypt data
export function encrypt(data) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);

    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
    encrypted += cipher.final('base64');

    return {
        encryptedData: encrypted,
        iv: iv.toString('base64'),
    };
}

// Function to decrypt data
export function decrypt({ encryptedData, iv }) {
    const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        ENCRYPTION_KEY,
        Buffer.from(iv, 'base64')
    );

    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
}