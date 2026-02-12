
import { pool } from "../../config/config.js";

const createCustomer = async (data, userId) => {
    try {
        const query = `
            INSERT INTO customers (customer_name, email, phone, address, created_by, is_active)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        // data.created_by might have been passed in body, but better to use authenticated userId if available
        const creator = userId || data.created_by || 0;
        const values = [data.customer_name, data.email, data.phone, data.address, creator, data.is_active];
        const result = await pool.query(query, values);
        return { success: true, data: result.rows[0] };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const getAllCustomers = async () => {
    try {
        const result = await pool.query("SELECT * FROM customers WHERE deleted_at IS NULL ORDER BY created_at DESC");
        return { success: true, data: result.rows };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const getCustomerById = async (id) => {
    try {
        const result = await pool.query("SELECT * FROM customers WHERE id = $1 AND deleted_at IS NULL", [id]);
        if (result.rows.length === 0) return { success: false, message: "Customer not found" };
        return { success: true, data: result.rows[0] };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const updateCustomer = async (id, data, userId) => {
    try {
        const query = `
            UPDATE customers
            SET customer_name = $1, email = $2, phone = $3, address = $4, is_active = $5, updated_by = $6, updated_at = CURRENT_TIMESTAMP
            WHERE id = $7
            RETURNING *;
        `;
        const values = [data.customer_name, data.email, data.phone, data.address, data.is_active, userId, id];
        const result = await pool.query(query, values);
        return { success: true, data: result.rows[0] };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const toggleCustomerStatus = async (id, status, userId) => {
    try {
        const result = await pool.query("UPDATE customers SET is_active = $1, updated_by = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *", [status, id, userId]);
        return { success: true, data: result.rows[0] };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const saveTerms = async (id, terms, userId) => {
    try {
        const result = await pool.query("UPDATE customers SET terms = $1, updated_by = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *", [terms, id, userId]);
        return { success: true, data: result.rows[0] };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export { createCustomer, getAllCustomers, getCustomerById, updateCustomer, toggleCustomerStatus, saveTerms };
