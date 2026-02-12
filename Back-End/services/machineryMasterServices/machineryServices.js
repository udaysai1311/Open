
import { pool } from "../../config/config.js";

// --- Machinery Master (Main Categories) ---

const createMachinery = async (data, userId) => {
    try {
        const query = `
            INSERT INTO machinery_master (name, main_category_id, description, created_by)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [data.name, data.main_category_id, data.description, userId];
        const result = await pool.query(query, values);
        return { success: true, data: result.rows[0] };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const getAllMachinery = async () => {
    try {
        const result = await pool.query("SELECT * FROM machinery_master WHERE deleted_at IS NULL ORDER BY created_at DESC");
        return { success: true, data: result.rows };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const deleteMachinery = async (id, userId) => {
    try {
        const query = "UPDATE machinery_master SET deleted_at = CURRENT_TIMESTAMP, deleted_by = $1 WHERE id = $2";
        await pool.query(query, [userId, id]);
        return { success: true, message: "Machinery category deleted successfully" };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// --- Machinery Subcategories ---

const createSubCategory = async (data, userId) => {
    try {
        const query = `
            INSERT INTO machinery_subcategories (category_id, subcategory_name, description, created_by)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [data.category_id, data.subcategory_name, data.description, userId];
        const result = await pool.query(query, values);
        return { success: true, data: result.rows[0] };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const getAllSubCategories = async () => {
    try {
        const query = `
            SELECT s.*, m.name as category_name 
            FROM machinery_subcategories s
            JOIN machinery_master m ON s.category_id = m.id
            WHERE s.deleted_at IS NULL
            ORDER BY s.created_at DESC
        `;
        const result = await pool.query(query);
        return { success: true, data: result.rows };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const deleteSubCategory = async (id, userId) => {
    try {
        const query = "UPDATE machinery_subcategories SET deleted_at = CURRENT_TIMESTAMP, deleted_by = $1 WHERE id = $2";
        await pool.query(query, [userId, id]);
        return { success: true, message: "Subcategory deleted successfully" };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// --- Process Pricing ---

const createProcessPricing = async (data, userId) => {
    try {
        const query = `
            INSERT INTO process_pricing (material_id, process_id, minutes, unit, rate, is_manual_rate, note, remark, created_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *;
        `;
        const values = [data.material_id, data.process_id, data.minutes, data.unit, data.rate, data.is_manual_rate, data.note, data.remark, userId];
        const result = await pool.query(query, values);
        return { success: true, data: result.rows[0] };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const getAllProcessPricing = async () => {
    try {
        const query = `
            SELECT pp.*, m.material_name, s.subcategory_name as process_name
            FROM process_pricing pp
            JOIN materials m ON pp.material_id = m.id
            JOIN machinery_subcategories s ON pp.process_id = s.id
            WHERE pp.deleted_at IS NULL
            ORDER BY pp.created_at DESC
        `;
        const result = await pool.query(query);
        return { success: true, data: result.rows };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const deleteProcessPricing = async (id, userId) => {
    try {
        const query = "UPDATE process_pricing SET deleted_at = CURRENT_TIMESTAMP, deleted_by = $1 WHERE id = $2";
        await pool.query(query, [userId, id]);
        return { success: true, message: "Pricing deleted successfully" };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export {
    createMachinery, getAllMachinery, deleteMachinery,
    createSubCategory, getAllSubCategories, deleteSubCategory,
    createProcessPricing, getAllProcessPricing, deleteProcessPricing
};
