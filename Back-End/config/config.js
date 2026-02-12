
import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const checkConnection = async () => {
    try {
        const client = await pool.connect();
        console.log("DB Connected Successful!");
        client.release();
    } catch (err) {
        console.log("Error Connecting DataBase!", err.message);
    }
};

export { pool, checkConnection };
