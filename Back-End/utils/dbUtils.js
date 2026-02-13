
import { pool } from '../config/config.js';

const createAllTables = async () => {
    const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        user_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        mobile_number VARCHAR(15),
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        department VARCHAR(50),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by integer NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by integer,
        deleted_at TIMESTAMP,
        deleted_by integer
    );
    `;

    const createCustomerTableQuery = `
    CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_abbr VARCHAR(6) NOT NULL,
        contact_person VARCHAR(255),
        contact_person_designation VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        address TEXT,
        terms TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by integer NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by integer,
        deleted_at TIMESTAMP,
        deleted_by integer
    );
    `;

    const createMaterialTableQuery = `
    CREATE TABLE IF NOT EXISTS materials (
        id SERIAL PRIMARY KEY,
        material_name VARCHAR(255) NOT NULL,
        material_grade VARCHAR(100),
        density VARCHAR(50),
        unit VARCHAR(50),
        current_price DECIMAL(10, 2),
        description TEXT,
        remark TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by integer NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by integer,
        deleted_at TIMESTAMP,
        deleted_by integer
    );
    `;

    const createMaterialTypeTableQuery = `
    CREATE TABLE IF NOT EXISTS material_types (
        id SERIAL PRIMARY KEY,
        type_name VARCHAR(255) NOT NULL,
        description TEXT,
        remark TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by integer NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by integer,
        deleted_at TIMESTAMP,
        deleted_by integer
    );
    `;

    const createMaterialLinkTableQuery = `
    CREATE TABLE IF NOT EXISTS material_type_links (
        id SERIAL PRIMARY KEY,
        material_id INTEGER REFERENCES materials(id) ON DELETE CASCADE,
        material_type_id INTEGER REFERENCES material_types(id) ON DELETE CASCADE,
        current_price DECIMAL(10, 2),
        remark TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by integer NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by integer,
        deleted_at TIMESTAMP,
        deleted_by integer
    );
    `;

    const createMachineryMasterTableQuery = `
    CREATE TABLE IF NOT EXISTS machinery_master (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        main_category_id INTEGER,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by integer NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by integer,
        deleted_at TIMESTAMP,
        deleted_by integer
    );
    `;

    const createMachinerySubTableQuery = `
    CREATE TABLE IF NOT EXISTS machinery_subcategories (
        id SERIAL PRIMARY KEY,
        category_id INTEGER REFERENCES machinery_master(id) ON DELETE CASCADE,
        subcategory_name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by integer NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by integer,
        deleted_at TIMESTAMP,
        deleted_by integer
    );
    `;

    const createProcessPricingTableQuery = `
    CREATE TABLE IF NOT EXISTS process_pricing (
        id SERIAL PRIMARY KEY,
        material_id INTEGER REFERENCES materials(id) ON DELETE CASCADE,
        process_id INTEGER REFERENCES machinery_subcategories(id) ON DELETE CASCADE,
        minutes DECIMAL(10, 2),
        unit VARCHAR(50),
        rate DECIMAL(10, 2),
        is_manual_rate BOOLEAN DEFAULT FALSE,
        note TEXT,
        remark TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by integer NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by integer,
        deleted_at TIMESTAMP,
        deleted_by integer
    );
    `;

    const createQuotationTableQuery = `
    CREATE TABLE IF NOT EXISTS quotations (
        id SERIAL PRIMARY KEY,
        quotation_number VARCHAR(100) NOT NULL UNIQUE,
        revision_number INTEGER DEFAULT 0,
        customer_id INTEGER REFERENCES customers(id),
        customer_name VARCHAR(255),
        our_drawing_ref VARCHAR(100),
        customer_drawing_ref VARCHAR(100),
        drawing_desc TEXT,
        contact_person VARCHAR(100),
        enquiry_number VARCHAR(100),
        enquiry_date DATE,
        quotation_date DATE,
        valid_till DATE,
        currency VARCHAR(10),
        status VARCHAR(50) DEFAULT 'Draft',
        remark TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by integer NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by integer,
        deleted_at TIMESTAMP,
        deleted_by integer
    );
    `;

    const createQuotationLineTableQuery = `
    CREATE TABLE IF NOT EXISTS quotation_lines (
        id SERIAL PRIMARY KEY,
        quotation_id INTEGER REFERENCES quotations(id) ON DELETE CASCADE,
        line_number INTEGER,
        drawing_description VARCHAR(255),
        drawing_number VARCHAR(100),
        material_grade VARCHAR(100),
        unit_price DECIMAL(10, 2),
        no_of_units INTEGER,
        total_price DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by integer NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by integer,
        deleted_at TIMESTAMP,
        deleted_by integer
    );
    `;

    try {
        await pool.query(createUserTableQuery);
        await pool.query(createCustomerTableQuery);
        await pool.query(createMaterialTableQuery);
        await pool.query(createMaterialTypeTableQuery);
        await pool.query(createMaterialLinkTableQuery);
        await pool.query(createMachineryMasterTableQuery);
        await pool.query(createMachinerySubTableQuery);
        await pool.query(createProcessPricingTableQuery);
        await pool.query(createQuotationTableQuery);
        await pool.query(createQuotationLineTableQuery);
        console.log("All tables created successfully!");
    } catch (error) {
        console.log("Error creating tables:", error);
    }
};

export default createAllTables;
