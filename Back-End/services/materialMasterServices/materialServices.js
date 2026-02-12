
import { pool } from "../../config/config.js";

// --- Materials ---

const createMaterial = async (data, userId) => {
    try {
        const query = `
            INSERT INTO materials (material_name, material_grade, density, unit, current_price, description, remark, created_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const values = [data.material_name, data.material_grade, data.density, data.unit, data.current_price, data.description, data.remark, userId];
        const result = await pool.query(query, values);
        return { success: true, data: result.rows[0] };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const getAllMaterials = async () => {
    try {
        const result = await pool.query("SELECT * FROM materials ORDER BY created_at DESC");
        return { success: true, data: result.rows };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const getMaterialById = async (id) => {
    try {
        const result = await pool.query("SELECT * FROM materials WHERE id = $1", [id]);
        if (result.rows.length === 0) return { success: false, message: "Material not found" };
        return { success: true, data: result.rows[0] };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const updateMaterial = async (id, data, userId) => {
    try {
        const query = `
            UPDATE materials
            SET material_name = $1, material_grade = $2, density = $3, unit = $4, current_price = $5, description = $6, remark = $7, updated_by = $8, updated_at = CURRENT_TIMESTAMP
            WHERE id = $9
            RETURNING *;
        `;
        const values = [data.material_name, data.material_grade, data.density, data.unit, data.current_price, data.description, data.remark, userId, id];
        const result = await pool.query(query, values);
        return { success: true, data: result.rows[0] };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const deleteMaterial = async (id, userId) => {
    try {
        // Soft delete? or Hard delete? User didn't specify, but added deleted_at column.
        // I will use soft delete if column exists, but for now user just said "add in schems".
        // dbUtils has deleted_at/deleted_by. So I should use soft delete.
        const query = "UPDATE materials SET deleted_at = CURRENT_TIMESTAMP, deleted_by = $1 WHERE id = $2";
        await pool.query(query, [userId, id]);
        return { success: true, message: "Material deleted successfully" };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// --- Material Types ---

const createMaterialType = async (data, userId) => {
    try {
        const query = `
            INSERT INTO material_types (type_name, description, remark, created_by)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [data.type_name, data.description, data.remark, userId];
        const result = await pool.query(query, values);
        return { success: true, data: result.rows[0] };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const getAllMaterialTypes = async () => {
    try {
        const result = await pool.query("SELECT * FROM material_types WHERE deleted_at IS NULL ORDER BY created_at DESC");
        return { success: true, data: result.rows };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const updateMaterialType = async (id, data, userId) => {
    try {
        const query = `
            UPDATE material_types
            SET type_name = $1, description = $2, remark = $3, updated_by = $4, updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING *;
        `;
        const values = [data.type_name, data.description, data.remark, userId, id];
        const result = await pool.query(query, values);
        return { success: true, data: result.rows[0] };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const deleteMaterialType = async (id, userId) => {
    try {
        const query = "UPDATE material_types SET deleted_at = CURRENT_TIMESTAMP, deleted_by = $1 WHERE id = $2";
        await pool.query(query, [userId, id]);
        return { success: true, message: "Material Type deleted successfully" };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// --- Material Linking ---

const linkMaterialType = async (data, userId) => {
    try {
        const query = `
            INSERT INTO material_type_links (material_id, material_type_id, current_price, remark, created_by)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [data.material_id, data.material_type_id, data.current_price, data.remark, userId];
        const result = await pool.query(query, values);
        return { success: true, data: result.rows[0] };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const getLinkedMaterials = async () => {
    try {
        const query = `
            SELECT l.id, m.material_name, t.type_name, l.current_price, l.remark, m.unit
            FROM material_type_links l
            JOIN materials m ON l.material_id = m.id
            JOIN material_types t ON l.material_type_id = t.id
            WHERE l.deleted_at IS NULL
            ORDER BY l.created_at DESC;
        `;
        const result = await pool.query(query);
        return { success: true, data: result.rows };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const deleteLinkedMaterial = async (id, userId) => {
    try {
        const query = "UPDATE material_type_links SET deleted_at = CURRENT_TIMESTAMP, deleted_by = $1 WHERE id = $2";
        await pool.query(query, [userId, id]);
        return { success: true, message: "Link deleted successfully" };
    } catch (error) {
        return { success: false, message: error.message };
    }
};


export {
    createMaterial, getAllMaterials, getMaterialById, updateMaterial, deleteMaterial,
    createMaterialType, getAllMaterialTypes, updateMaterialType, deleteMaterialType,
    linkMaterialType, getLinkedMaterials, deleteLinkedMaterial
};
