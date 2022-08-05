import express from 'express';
import {loginRouter} from "./auth/login.mjs";
import {getOrderByStatus} from "./order/get-order-by-status.mjs";
import {getOrderProductHistory} from "./order/get-order-product-history.mjs";
import {changeOrderDeliveryPriceRouter} from "./order/change-order-delivery-price.mjs";
import {cancelOrderRouter} from "./order/cancel-order.mjs";
import {acceptOrderRouter} from "./order/accept-order.mjs";
import {deliveryOrderRouter} from "./order/delivery-order.mjs";
import {deliveryOrderProductRouter} from "./order/delivery-order-product.mjs";
import { getCancelReasonRouter } from './order/get-cancel-reason.mjs';

const deliveryRouter = express.Router();

deliveryRouter.use('/auth',loginRouter);
deliveryRouter.use('/get-order-by-status',getOrderByStatus);
deliveryRouter.use('/get-order-product-history',getOrderProductHistory);
deliveryRouter.use('/change-order-delivery-price',changeOrderDeliveryPriceRouter);
deliveryRouter.use('/cancel-order',cancelOrderRouter);
deliveryRouter.use('/accept-order',acceptOrderRouter);
deliveryRouter.use('/delivery-order',deliveryOrderRouter);
deliveryRouter.use('/delivery-order-producs',deliveryOrderProductRouter);
deliveryRouter.use('/get-cancel-reason',getCancelReasonRouter);

export {deliveryRouter};