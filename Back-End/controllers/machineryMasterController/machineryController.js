
import * as service from "../../services/machineryMasterServices/machineryServices.js";

const getUserId = (req) => req.user ? req.user.id : 0;

// Machinery Master
const createMachinery = async (req, res) => {
    const userId = getUserId(req);
    const response = await service.createMachinery(req.body, userId);
    if (response.success) res.status(201).json(response.data);
    else res.status(500).json(response);
};

const getAllMachinery = async (req, res) => {
    const response = await service.getAllMachinery();
    if (response.success) res.status(200).json(response.data);
    else res.status(500).json(response);
};

const deleteMachinery = async (req, res) => {
    const userId = getUserId(req);
    const response = await service.deleteMachinery(req.params.id, userId);
    if (response.success) res.status(200).json(response);
    else res.status(500).json(response);
};

// Subcategories
const createSubCategory = async (req, res) => {
    const userId = getUserId(req);
    const response = await service.createSubCategory(req.body, userId);
    if (response.success) res.status(201).json(response.data);
    else res.status(500).json(response);
};

const getAllSubCategories = async (req, res) => {
    const response = await service.getAllSubCategories();
    if (response.success) res.status(200).json(response.data);
    else res.status(500).json(response);
};

const deleteSubCategory = async (req, res) => {
    const userId = getUserId(req);
    const response = await service.deleteSubCategory(req.params.id, userId);
    if (response.success) res.status(200).json(response);
    else res.status(500).json(response);
};

// Process Pricing
const createProcessPricing = async (req, res) => {
    const userId = getUserId(req);
    const response = await service.createProcessPricing(req.body, userId);
    if (response.success) res.status(201).json(response.data);
    else res.status(500).json(response);
};

const getAllProcessPricing = async (req, res) => {
    const response = await service.getAllProcessPricing();
    if (response.success) res.status(200).json(response.data);
    else res.status(500).json(response);
};

const deleteProcessPricing = async (req, res) => {
    const userId = getUserId(req);
    const response = await service.deleteProcessPricing(req.params.id, userId);
    if (response.success) res.status(200).json(response);
    else res.status(500).json(response);
};

export {
    createMachinery, getAllMachinery, deleteMachinery,
    createSubCategory, getAllSubCategories, deleteSubCategory,
    createProcessPricing, getAllProcessPricing, deleteProcessPricing
};
