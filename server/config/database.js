import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

let pool = null;

export default async function connectToDatabase() {
    const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
    requiredEnvVars.forEach((envVar) => {
        if (!process.env[envVar]) {
            console.error(`❌ Missing required environment variable: ${envVar}`);
            process.exit(1);
        }
    });

    try {
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
        console.log("✅ Secure database connection pool created successfully.");
    } catch (err) {
        console.error("❌ Error creating database connection pool:", err);
        process.exit(1);
    }
}

export async function execQuery(query, params = []) {
    if (!pool) {
        throw new Error("Database connection pool is not initialized.");
    }
    try {
        const [rows] = await pool.query(query, params); // Destructuring to get rows
        return rows;
    } catch (err) {
        console.error("❌ Database query error: ", err.message);
        throw err;
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    if (pool) {
        console.log("Closing database connection pool...");
        await pool.end();
    }
    process.exit(0);
});
