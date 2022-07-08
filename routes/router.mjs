import express from 'express';
import { adminRouter } from './admin/admin.mjs';
import { deliveryRouter } from './delivery/delivery.mjs';
import { operatorRouter } from './operator/operator.mjs';

const router = express.Router();

router.use('/operator',operatorRouter);
router.use('/admin',adminRouter);
router.use('/delivery',deliveryRouter);

export {router}