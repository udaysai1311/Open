
import * as service from "../../services/materialMasterServices/materialServices.js";

// Helper to get userId
const getUserId = (req) => req.user ? req.user.id : 0; // Fallback to 0 if auth missing (shouldn't happen if guarded)

// Materials
const createMaterial = async (req, res) => {
    const userId = getUserId(req);
    const response = await service.createMaterial(req.body, userId);
    if (response.success) res.status(201).json(response.data);
    else res.status(500).json(response);
};

const getMaterials = async (req, res) => {
    const response = await service.getAllMaterials();
    if (response.success) res.status(200).json(response.data);
    else res.status(500).json(response);
};

const getMaterialById = async (req, res) => {
    const response = await service.getMaterialById(req.params.id);
    if (response.success) res.status(200).json(response.data);
    else res.status(404).json(response);
};

const updateMaterial = async (req, res) => {
    const userId = getUserId(req);
    const response = await service.updateMaterial(req.params.id, req.body, userId);
    if (response.success) res.status(200).json(response.data);
    else res.status(500).json(response);
};

const deleteMaterial = async (req, res) => {
    const userId = getUserId(req);
    const response = await service.deleteMaterial(req.params.id, userId);
    if (response.success) res.status(200).json(response);
    else res.status(500).json(response);
};

// Types
const createType = async (req, res) => {
    const userId = getUserId(req);
    const response = await service.createMaterialType(req.body, userId);
    if (response.success) res.status(201).json(response.data);
    else res.status(500).json(response);
};

const getTypes = async (req, res) => {
    const response = await service.getAllMaterialTypes();
    if (response.success) res.status(200).json(response.data);
    else res.status(500).json(response);
};

const updateType = async (req, res) => {
    const userId = getUserId(req);
    const response = await service.updateMaterialType(req.params.id, req.body, userId);
    if (response.success) res.status(200).json(response.data);
    else res.status(500).json(response);
};

const deleteType = async (req, res) => {
    const userId = getUserId(req);
    const response = await service.deleteMaterialType(req.params.id, userId);
    if (response.success) res.status(200).json(response);
    else res.status(500).json(response);
};

// Linking
const linkMaterials = async (req, res) => {
    const userId = getUserId(req);
    const response = await service.linkMaterialType(req.body, userId);
    if (response.success) res.status(201).json(response.data);
    else res.status(500).json(response);
};

const getLinkedMaterials = async (req, res) => {
    const response = await service.getLinkedMaterials();
    if (response.success) res.status(200).json(response.data);
    else res.status(500).json(response);
};

const deleteLink = async (req, res) => {
    const userId = getUserId(req);
    const response = await service.deleteLinkedMaterial(req.params.id, userId);
    if (response.success) res.status(200).json(response);
    else res.status(500).json(response);
};

export {
    createMaterial, getMaterials, getMaterialById, updateMaterial, deleteMaterial,
    createType, getTypes, updateType, deleteType,
    linkMaterials, getLinkedMaterials, deleteLink
};
