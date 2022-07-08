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

export { operatorRouter };
