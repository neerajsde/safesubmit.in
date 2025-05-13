import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import useragent from 'useragent';

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure logs directory exists
const logDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const logFilePath = path.join(logDirectory, 'access-details.log');

export const requestLogger = (options = {}) => {
  return (req, res, next) => {
    const agent = useragent.parse(req.headers['user-agent']);
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
    const device = agent.device.toString();
    const browser = agent.toAgent();
    const osInfo = agent.os.toString();
    const date = new Date().toISOString();
    const url = req.originalUrl;

    const log = `[${date}] IP: ${ip} | Device: ${device} | OS: ${osInfo} | Browser: ${browser} | URL: ${url}\n`;

    fs.appendFile(logFilePath, log, (err) => {
      if (err && options.debug) {
        console.error('Failed to write log:', err);
      }
    });

    next();
  };
};
