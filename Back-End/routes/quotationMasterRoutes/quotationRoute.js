
import express from 'express';
import * as controller from '../../controllers/quotationMasterController/quotationController.js';

const router = express.Router();

router.post('/create', controller.create);
router.get('/getAll', controller.list);
router.get('/:id', controller.getById);
router.put('/:id/status', controller.updateStatus);

export default router;
