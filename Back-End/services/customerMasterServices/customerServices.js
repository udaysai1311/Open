
import { pool } from "../../config/config.js";

const createCustomer = async (data, userId) => {
    try {
        const query = `
            INSERT INTO customers (
                customer_name, customer_abbr, contact_person, contact_person_designation, 
                email, phone, address, created_by, is_active
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *;
        `;
        // data.created_by might have been passed in body, but better to use authenticated userId if available
        const creator = userId || data.created_by || 0;
        const values = [
            data.customer_name,
            data.customer_abbr,
            data.contact_person || null,
            data.contact_person_designation || null,
            data.email || null,
            data.phone || null,
            data.address || null,
            creator,
            data.is_active !== undefined ? data.is_active : true
        ];
        const result = await pool.query(query, values);
        return { success: true, data: { ...result.rows[0], customer_id: result.rows[0].id } };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const getAllCustomers = async () => {
    try {
        const result = await pool.query("SELECT *, id as customer_id FROM customers WHERE deleted_at IS NULL ORDER BY created_at DESC");
        return { success: true, data: result.rows };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const getCustomerById = async (id) => {
    try {
        const result = await pool.query("SELECT *, id as customer_id FROM customers WHERE id = $1 AND deleted_at IS NULL", [id]);
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
            SET customer_name = $1, customer_abbr = $2, contact_person = $3, contact_person_designation = $4,
                email = $5, phone = $6, address = $7, is_active = $8, updated_by = $9, updated_at = CURRENT_TIMESTAMP
            WHERE id = $10
            RETURNING *;
        `;
        const values = [
            data.customer_name,
            data.customer_abbr,
            data.contact_person || null,
            data.contact_person_designation || null,
            data.email || null,
            data.phone || null,
            data.address || null,
            data.is_active,
            userId,
            id
        ];
        const result = await pool.query(query, values);
        return { success: true, data: { ...result.rows[0], customer_id: result.rows[0].id } };
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
