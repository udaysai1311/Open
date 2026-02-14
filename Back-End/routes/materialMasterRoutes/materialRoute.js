
import express from 'express';
import * as controller from '../../controllers/materialMasterController/materialController.js';

const router = express.Router();

// Types
router.post('/type/add', controller.createType);
router.get('/type/getAll', controller.getTypes);
router.put('/type/:id', controller.updateType);
router.delete('/type/:id', controller.deleteType);

// Linking
router.post('/link/add', controller.linkMaterials);
router.get('/link/getAll', controller.getLinkedMaterials);
router.put('/link/:id', controller.updateLink);
router.delete('/link/:id', controller.deleteLink);

// Materials
router.post('/add', controller.createMaterial);
router.get('/getAll', controller.getMaterials);
router.get('/:id', controller.getMaterialById);
router.put('/:id', controller.updateMaterial);
router.delete('/:id', controller.deleteMaterial);

export default router;
