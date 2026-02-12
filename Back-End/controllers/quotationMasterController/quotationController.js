
import * as service from "../../services/quotationMasterServices/quotationServices.js";

const getUserId = (req) => req.user ? req.user.id : 0;

const create = async (req, res) => {
    const userId = getUserId(req);
    const response = await service.createQuotation(req.body, userId);
    if (response.success) res.status(201).json(response.data);
    else res.status(500).json(response);
};

const list = async (req, res) => {
    const response = await service.getAllQuotations();
    if (response.success) res.status(200).json(response.data);
    else res.status(500).json(response);
};

const getById = async (req, res) => {
    const response = await service.getQuotationById(req.params.id);
    if (response.success) res.status(200).json(response.data);
    else res.status(404).json(response);
};

const updateStatus = async (req, res) => {
    const userId = getUserId(req);
    const response = await service.updateQuotationStatus(req.params.id, req.body.status, userId);
    if (response.success) res.status(200).json(response.data);
    else res.status(500).json(response);
};

export { create, list, getById, updateStatus };
