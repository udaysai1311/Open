
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../../config/config.js";

const registerUser = async (user) => {
    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        // Ensure table columns match dbUtils: user_name, email, mobile_number, password
        // Ensure table columns match dbUtils, including created_by (using 0 for self-registration/system)
        const query = "INSERT INTO users (user_name, email, mobile_number, password, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_name, email";
        const values = [user.username, user.email, user.mobile, hashedPassword, 0];

        const result = await pool.query(query, values);

        return { success: true, message: "User Registered Successfully!", user: result.rows[0] };

    } catch (error) {
        return { success: false, message: "User Registration failed!", error: error.message };
    }
};

const loginUser = async (email, password) => {
    try {
        const query = "SELECT * FROM users WHERE email = $1";
        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            return { success: false, message: "User not found!" };
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return { success: false, message: "Invalid credentials!" };
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return { success: true, message: "Login Successful!", token, user: { id: user.id, username: user.user_name, email: user.email } };

    } catch (error) {
        return { success: false, message: "Login failed!", error: error.message };
    }
};

export { registerUser, loginUser };
