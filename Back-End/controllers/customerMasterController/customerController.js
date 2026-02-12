
import { createCustomer, getAllCustomers, getCustomerById, updateCustomer, toggleCustomerStatus, saveTerms } from "../../services/customerMasterServices/customerServices.js";

// Helper to get userId
const getUserId = (req) => req.user ? req.user.id : 0;

const create = async (req, res) => {
    const payload = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];
    const userId = getUserId(req);

    for (const customer of payload) {
        const response = await createCustomer(customer, userId);
        if (response.success) results.push(response.data);
    }

    // Simplistic response for bulk
    res.status(201).json(results);
};

const list = async (req, res) => {
    const response = await getAllCustomers();
    if (response.success) {
        // Map to format expected by search API in frontend (customer_id, customer_name)
        const mapped = response.data.map(c => ({
            customer_id: c.id,
            customer_name: c.customer_name,
            ...c
        }));
        res.status(200).json(mapped);
    } else {
        res.status(500).json(response);
    }
};

const getById = async (req, res) => {
    const response = await getCustomerById(req.params.id);
    if (response.success) {
        const c = response.data;
        const mapped = {
            customer_id: c.id,
            ...c
        };
        res.status(200).json(mapped);
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
