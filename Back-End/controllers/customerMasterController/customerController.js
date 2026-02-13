
import { createCustomer, getAllCustomers, getCustomerById, updateCustomer, toggleCustomerStatus, saveTerms } from "../../services/customerMasterServices/customerServices.js";

// Helper to get userId
const getUserId = (req) => req.user ? req.user.id : 0;

const create = async (req, res) => {
    try {
        console.log("Received Customer Payload:", JSON.stringify(req.body, null, 2));

        const payload = Array.isArray(req.body) ? req.body : [req.body];
        const results = [];
        const userId = getUserId(req);

        for (const customer of payload) {
            const response = await createCustomer(customer, userId);
            if (response.success) results.push(response.data);
            else {
                console.error("Error creating customer:", customer.customer_name, response.message);
                results.push({ error: response.message, customer: customer.customer_name });
            }
        }

        // Return 201 with results. If some failed, they will contain error messages.
        res.status(201).json(results);
    } catch (error) {
        console.error("Critical error in create customer controller:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const list = async (req, res) => {
    const response = await getAllCustomers();
    if (response.success) {
        // The DB now returns `customer_id` natively.
        res.status(200).json(response.data);
    } else {
        res.status(500).json(response);
    }
};

const getById = async (req, res) => {
    const response = await getCustomerById(req.params.id);
    if (response.success) {
        // The DB returns `customer_id` natively.
        res.status(200).json(response.data);
    } else {
        res.status(404).json(response);
    }
};

const update = async (req, res) => {
    const userId = getUserId(req);
    const response = await updateCustomer(req.params.id, req.body, userId);
    if (response.success) res.status(200).json(response);
    else res.status(500).json(response);
};

const disable = async (req, res) => {
    const userId = getUserId(req);
    const response = await toggleCustomerStatus(req.params.id, false, userId);
    if (response.success) res.status(200).json(response);
    else res.status(500).json(response);
};

const enable = async (req, res) => {
    const userId = getUserId(req);
    const response = await toggleCustomerStatus(req.params.id, true, userId);
    if (response.success) res.status(200).json(response);
    else res.status(500).json(response);
};

const updateTerms = async (req, res) => {
    const userId = getUserId(req);
    const response = await saveTerms(req.params.id, req.body.terms, userId);
    if (response.success) res.status(200).json(response);
    else res.status(500).json(response);
};

export { create, list, getById, update, disable, enable, updateTerms };
