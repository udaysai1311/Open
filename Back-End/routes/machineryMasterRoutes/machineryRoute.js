
import express from 'express';
import * as controller from '../../controllers/machineryMasterController/machineryController.js';

const router = express.Router();

// Machinery Master
router.post('/add', controller.createMachinery);
router.get('/getAll', controller.getAllMachinery);
router.delete('/:id', controller.deleteMachinery);

// Subcategories
router.post('/sub/add', controller.createSubCategory);
router.get('/sub/getAll', controller.getAllSubCategories);
router.delete('/sub/:id', controller.deleteSubCategory);

// Process Pricing
router.post('/pricing/add', controller.createProcessPricing);
router.get('/pricing/getAll', controller.getAllProcessPricing);
router.delete('/pricing/:id', controller.deleteProcessPricing);

export default router;
