import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url'; 
import resSender from '../utils/resSender.js';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function sendFile(req, res) {
    try {
        const { filename } = req.query;

        if (!filename) {
            return resSender(res, 400, false, 'Filename is required')
            // return res.status(400).send('Filename query parameter is required');
        }

        const BASE_DIR = path.join(__dirname, '../public/files');
        const safeFilename = path.basename(filename); // prevent path traversal
        const filePath = path.join(BASE_DIR, safeFilename);

        // Check if file exists
        await fs.access(filePath);

        // Send the file
        return res.sendFile(filePath);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return resSender(res, 400, false, 'File not found');
            // return res.status(404).send('File not found');
        }

        console.error('Error:', err.message);
        return resSender(res, 500, false, 'Internal Server Error');
        // return res.status(500).send('Internal Server Error');
    }
}
