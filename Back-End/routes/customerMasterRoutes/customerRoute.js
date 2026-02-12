
import express from 'express';
import { create, list, getById, update, disable, enable, updateTerms } from '../../controllers/customerMasterController/customerController.js';

const router = express.Router();

router.post('/create', create); // Matches VITE_CUSTOMER_REGISTRATION_API_URL
router.get('/customers', list); // Matches VITE_CUSTOMER_FOR_SEARCH_API_URL
router.get('/getcustomerbyId/:id', getById); // Matches VITE_CUSTOMER_DETAILS_API_URL
router.put('/update/:id', update); // Matches VITE_CUSTOMER_UPDATE_API_URL
router.put('/:id/disable', disable); // Matches VITE_CUSTOMER_DISABLE_API_URL
router.put('/:id/enable', enable); // Matches VITE_CUSTOMER_ENABLE_API_URL
router.put('/:id/saveTerms', updateTerms); // Matches VITE_CUSTOMER_SAVE_TERMS_API_URL

export default router;
