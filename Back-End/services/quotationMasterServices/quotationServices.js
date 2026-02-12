
import { pool } from "../../config/config.js";

const createQuotation = async (data, userId) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Insert Quotation
        const qQuery = `
            INSERT INTO quotations (
                quotation_number, revision_number, customer_id, customer_name, our_drawing_ref, customer_drawing_ref, 
                drawing_desc, contact_person, enquiry_number, enquiry_date, quotation_date, valid_till, 
                currency, status, remark, created_by
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
            RETURNING *;
        `;
        const qValues = [
            data.quotation_number, 0, data.customer_id, data.customer_name, data.our_drawing_ref, data.customer_drawing_ref,
            data.drawing_desc, data.contact_person, data.enquiry_number, data.enquiry_date, data.quotation_date, data.valid_till,
            data.currency, 'Draft', data.remark, userId
        ];
        const qResult = await client.query(qQuery, qValues);
        const quotation = qResult.rows[0];

        // Insert Lines
        if (data.lines && data.lines.length > 0) {
            const lQuery = `
                INSERT INTO quotation_lines (
                    quotation_id, line_number, drawing_description, drawing_number, material_grade, 
                    unit_price, no_of_units, total_price, created_by
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            `;
            for (const line of data.lines) {
                await client.query(lQuery, [
                    quotation.id, line.line_number, line.drawing_description, line.drawing_number, line.material_grade,
                    line.unit_price, line.no_of_units, line.total_price, userId
                ]);
            }
        }

        await client.query('COMMIT');
        return { success: true, data: quotation };
    } catch (error) {
        await client.query('ROLLBACK');
        return { success: false, message: error.message };
    } finally {
        client.release();
    }
};

const getAllQuotations = async () => {
    try {
        // Exclude deleted? Quotations usually not soft deleted in this simple plan, but let's check field
        // The table has deleted_at from standard audit.
        const result = await pool.query("SELECT * FROM quotations WHERE deleted_at IS NULL ORDER BY created_at DESC");
        return { success: true, data: result.rows };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const getQuotationById = async (id) => {
    try {
        const qResult = await pool.query("SELECT * FROM quotations WHERE id = $1 AND deleted_at IS NULL", [id]);
        if (qResult.rows.length === 0) return { success: false, message: "Quotation not found" };

        const lResult = await pool.query("SELECT * FROM quotation_lines WHERE quotation_id = $1 AND deleted_at IS NULL ORDER BY line_number ASC", [id]);

        const quotation = qResult.rows[0];
        quotation.lines = lResult.rows;

        return { success: true, data: quotation };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const updateQuotationStatus = async (id, status, userId) => {
    try {
        const result = await pool.query(
            "UPDATE quotations SET status = $1, updated_by = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
            [status, id, userId]
        );
        return { success: true, data: result.rows[0] };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export { createQuotation, getAllQuotations, getQuotationById, updateQuotationStatus };
