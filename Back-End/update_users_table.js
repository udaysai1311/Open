import { pool } from './config/config.js';
import dotenv from 'dotenv';

dotenv.config();

const updateSchema = async () => {
    try {
        console.log('Checking for company_code column in users table...');
        const checkColumnQuery = `
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='users' AND column_name='company_code';
        `;
        const res = await pool.query(checkColumnQuery);

        if (res.rows.length === 0) {
            console.log('Adding company_code column...');
            await pool.query('ALTER TABLE users ADD COLUMN company_code VARCHAR(10) NOT NULL DEFAULT \'UNI001\';');
            console.log('Column added successfully.');
        } else {
            console.log('company_code column already exists.');
        }
    } catch (error) {
        console.error('Error updating schema:', error);
    } finally {
        await pool.end();
    }
};

updateSchema();
