import { encrypt } from './parse.js';

export default function resSender(res, statusCode, success, message, data = null) {
    const responsePayload = { success, message };

    // Include additional data if provided
    if (data) {
        responsePayload.data = data;
    }

    // Encrypt the response
    const encodedResponse = encrypt(responsePayload);
    // const encodedResponse = responsePayload; // only for testing

    res.status(statusCode).json(encodedResponse);
}
