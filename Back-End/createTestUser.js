import bcrypt from 'bcrypt';
import { pool } from './config/config.js';
import dotenv from 'dotenv';

dotenv.config();

const createTestUser = async () => {
    const password = 'Password@123';
    const email = 'test@example.com';
    const username = 'Test User';
    const companyCode = 'UNI001';
    const mobile = '1234567890';

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Ensure pool is connected (it happens on query)
        const checkQuery = "SELECT id FROM users WHERE email = $1";
        const checkResult = await pool.query(checkQuery, [email]);

        if (checkResult.rows.length > 0) {
            console.log('Cleanup: Deleting existing test user...');
            await pool.query("DELETE FROM users WHERE email = $1", [email]);
        }

        const query = "INSERT INTO users (user_name, company_code, email, mobile_number, password, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, user_name, company_code, email";
        const values = [username, companyCode, email, mobile, hashedPassword, 0];

        const result = await pool.query(query, values);
        console.log('Test User Created Successfully:');
        console.log('Company Code:', result.rows[0].company_code);
        console.log('Email:', result.rows[0].email);
        console.log('Password:', password);

    } catch (error) {
        console.error('Error creating test user:', error);
    } finally {
        await pool.end();
    }
};

createTestUser();
