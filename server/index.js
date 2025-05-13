import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import fileUpload from 'express-fileupload';
import connectToDatabase from './config/database.js';
import connectRedis from './config/redis.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import formRoutes from './routes/form.js';
import settings from './routes/settings.js';
import profile from './routes/profile.js';
import files from './routes/files.js';
import formSubmissionRoutes from './routes/formSubmission.js';
import { requestLogger } from './middleware/requestLogger.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4040;

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security Middlewares
app.use(helmet());
app.use(mongoSanitize());
app.use(requestLogger({ debug: true }));
app.use(fileUpload());

// Rate Limiting (Only for API Routes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP
  message: "Too many requests, please try again later.",
});

app.use('/api', limiter); // ✅ Applied only to API routes

// Middleware
app.use(express.json({ limit: '10mb' })); // ✅ Removed unnecessary bodyParser.json()
app.use(express.urlencoded({ limit: '10mb', extended: true })); // ✅ Removed bodyParser.urlencoded()
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Secure Cookies for Authenticated Routes Only
app.use('/api/v1/user', (req, res, next) => {
  res.cookie('session', 'secureSessionToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  next();
});

// Database Connection
connectToDatabase();
await connectRedis();

// Serve React Static Files
const buildPath = path.join(__dirname, 'public');
app.use(express.static(buildPath));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(buildPath, 'index.html'));
});
app.use('/public', express.static(path.join(__dirname, 'public')));
// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/form', formRoutes);
app.use('/api/v1/settings', settings);
app.use('/api/v1/profile', profile);
app.use('/api/v1', formSubmissionRoutes);
app.use('/api/v1/file', files);

// Error Handling Middlewares
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
