import express from "express";
import requestIp from "request-ip";
import { response } from "../../modules/response.mjs";
import { loginRouter } from "./auth/login.mjs";
import { logoutRouter } from "./auth/logout.mjs";
import { missedCallRouter } from "./phone-calls/missed-call.mjs";
import { acceptedCallRouter } from "./phone-calls/accepted-call.mjs";
import { addCustomerRouter } from "./customer/add-customer.mjs";
import { addCustomerInterestedProductRoute } from "./customer/add-customer-interested-product.mjs";
import { editCustomerRouter } from "./customer/edit-customer.mjs";
import { getCustomerRouter } from "./customer/get-customer.mjs";
import { addOrderRouter } from "./order/add-order.mjs";
import { ringingCallRouter } from "./phone-calls/ringing-call.mjs";
import { getSingleCustomer } from "./customer/get-single-customer.mjs";
import { getFieldRouter } from "./other/get-fields.mjs";
import {changeOrderStatusRouter} from "./order/change-order-status.mjs";
import {getStatus} from "./other/get-status.mjs";
import {changeOrderCourierRouter} from "./order/change-order-courier.mjs";
import {changeOrderLocationRouter} from "./order/changeOrderLocation.mjs";
import {changeOrderAddressRouter} from "./order/change-order-address.mjs";
import { changeOrderDateRouter } from "./order/change-order-date.mjs";
import { changeOrderDeliveryPriceRouter } from "./order/change-order-delivery-price.mjs";
import { changeOrderProductRouter } from "./order/change-order-product.mjs";
import { editOrderProductStatus } from "./order/edit-order-product-status.mjs";
import { getOrdersRouter } from "./order/get-orders.mjs";
import { getOrderProductStatusRouter } from "./order/get-order-product-status.mjs";
import { getCouriersRouter } from "./other/get-courier.mjs";
import {addCourierRouter} from "./courier/add-courier.mjs";
import {getCouriersBySellIdRouter} from "./courier/get-couriers-by-sell-id.mjs";
import {addInbox} from "./inbox/add-inbox.mjs";
import {removeInbox} from "./inbox/remove-inbox.mjs";
import {markAsReadRouter} from "./inbox/mark-as-read.mjs";
import {getInboxRouter} from "./inbox/get-inbox.mjs";
import {getUnreadInboxCount} from "./inbox/get-unread-count.mjs";
import {getAllCustomerRouter} from "./customer/get-all-customer.mjs";
import {getOrderProductHistory} from "./order/get-order-product-history.mjs";
import {getAllCustomer} from "./sync/get-all-customer.mjs";
import {getAllOrders} from "./sync/get-all-orders.mjs";
import {checkByUniqueId} from "./sync/check-by-unique-id.mjs";
import {insertValues} from "./sync/insert-values.mjs";
import {truncateTable} from "./sync/truncate-table.mjs";
import {getOrderByStatus} from "./courier/get-order-by-status.mjs";

const operatorRouter = express.Router();

operatorRouter.get("/test-connection", (req, res) => {
  const clientIp = requestIp.getClientIp(req);
  console.log("Operator test connection from: " + clientIp);
  res.json(
    response(
      false,
      "Successfully connected to server",
      "Client IP: " + clientIp
    )
  );
});

operatorRouter.use('/show-call',ringingCallRouter);
operatorRouter.use("/auth", loginRouter);
operatorRouter.use("/auth-v2", logoutRouter);
operatorRouter.use("/get-missed-calls",missedCallRouter);
operatorRouter.use("/get-accepted-calls",acceptedCallRouter);
operatorRouter.use("/add-customer",addCustomerRouter);
operatorRouter.use("/add-customer-interested-products",addCustomerInterestedProductRoute);
operatorRouter.use('/edit-customer',editCustomerRouter);
operatorRouter.use('/get-customers',getCustomerRouter);
operatorRouter.use('/get-single-customer',getSingleCustomer);
operatorRouter.use('/add-order',addOrderRouter);
operatorRouter.use('/get-fields',getFieldRouter);
operatorRouter.use('/change-order-status',changeOrderStatusRouter);
operatorRouter.use('/get-statuses',getStatus);
operatorRouter.use('/change-order-courier',changeOrderCourierRouter);
operatorRouter.use('/change-order-location',changeOrderLocationRouter);
operatorRouter.use('/change-order-address',changeOrderAddressRouter);
operatorRouter.use('/change-order-date',changeOrderDateRouter);
operatorRouter.use('/change-order-delivery-price',changeOrderDeliveryPriceRouter);
operatorRouter.use('/change-order-product',changeOrderProductRouter);
operatorRouter.use('/change-order-product-status',editOrderProductStatus);
operatorRouter.use('/get-orders',getOrdersRouter);
operatorRouter.use('/get-order-product-status',getOrderProductStatusRouter);
operatorRouter.use('/get-order-product-history',getOrderProductHistory);
operatorRouter.use('/get-couriers',getCouriersRouter);
operatorRouter.use('/add-courier',addCourierRouter);
operatorRouter.use('/get-couriers-full',getCouriersBySellIdRouter);
operatorRouter.use('/add-inbox',addInbox);
operatorRouter.use('/remove-inbox',removeInbox);
operatorRouter.use('/mark-as-read',markAsReadRouter);
operatorRouter.use('/get-inbox',getInboxRouter);
operatorRouter.use('/get-unread-inbox-count',getUnreadInboxCount);
operatorRouter.use('/get-all-customer',getAllCustomerRouter);
operatorRouter.use('/get-order-by-status',getOrderByStatus);

//SYNC
operatorRouter.use('/get-all-customers',getAllCustomer);
operatorRouter.use('/get-all-orders',getAllOrders);
operatorRouter.use('/check-by-unique-id',checkByUniqueId);
operatorRouter.use('/insert-values',insertValues);
operatorRouter.use('/clear-values',truncateTable);

export { operatorRouter };
