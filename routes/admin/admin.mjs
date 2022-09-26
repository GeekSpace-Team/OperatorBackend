import express from "express";
import { loginRouter } from "./auth/login.mjs";
import { addCancelReason } from "./cancel-reason/add-cancel-reason.mjs";
import { deleteCancelReason } from "./cancel-reason/delete-cancel-reason.mjs";
import { getCancelReason } from "./cancel-reason/get-cancel-reason.mjs";
import { updateCancelReason } from "./cancel-reason/update-cancel-reason.mjs";
import { addCourier } from "./courier/add-user.mjs";
import { deleteCourier } from "./courier/delete-user.mjs";
import { getCourierRouter } from "./courier/get-user-by-role-name.mjs";
import { updateCourier } from "./courier/update-user.mjs";
import { addInfo } from "./info/add-info.mjs";
import { deleteInfo } from "./info/delete-info.mjs";
import { getInfo } from "./info/get-info.mjs";
import { updateInfo } from "./info/update-info.mjs";
import { addSellPoint } from "./sell-point/add-sell-point.mjs";
import { deleteSellPoint } from "./sell-point/delete-sell-point.mjs";
import { getSellPoint } from "./sell-point/get-sell-points.mjs";
import { updateSellPoint } from "./sell-point/update-sell-point.mjs";
import { getCourierStatistics } from "./statistics/get-courier-statistics.mjs";
import { getOperatorStatistics } from "./statistics/get-operator-statistics.mjs";
import { getStatistics } from "./statistics/get-statistics.mjs";
import { addUserRole } from "./user-role/add-user-role.mjs";
import { deleteUserRole } from "./user-role/delete-user-role.mjs";
import { getUserRole } from "./user-role/get-user-role.mjs";
import { updateUserRole } from "./user-role/update-user-role.mjs";
import { addUser } from "./users/add-user.mjs";
import { deleteUser } from "./users/delete-user.mjs";
import { getUserByRoleName } from "./users/get-user-by-role-name.mjs";
import { updateUser } from "./users/update-user.mjs";

const adminRouter = express.Router();

adminRouter.use('/auth/',loginRouter);
adminRouter.use('/get-statistics',getStatistics);
adminRouter.use('/get-operator-statistics',getOperatorStatistics);
adminRouter.use('/get-courier-statistics',getCourierStatistics);
adminRouter.use('/get-users-by-role-name',getUserByRoleName);
adminRouter.use('/add-user',addUser);
adminRouter.use('/update-user',updateUser);
adminRouter.use('/delete-user',deleteUser);
adminRouter.use('/get-sell-point',getSellPoint);
adminRouter.use('/add-sell-point',addSellPoint);
adminRouter.use('/update-sell-point',updateSellPoint);
adminRouter.use('/delete-sell-point',deleteSellPoint);
adminRouter.use('/get-info',getInfo);
adminRouter.use('/add-info',addInfo);
adminRouter.use('/update-info',updateInfo);
adminRouter.use('/delete-info',deleteInfo);
adminRouter.use('/get-user-role',getUserRole);
adminRouter.use('/add-user-role',addUserRole);
adminRouter.use('/update-user-role',updateUserRole);
adminRouter.use('/delete-user-role',deleteUserRole);
adminRouter.use('/add-courier',addCourier);
adminRouter.use('/update-courier',updateCourier);
adminRouter.use('/delete-courier',deleteCourier);
adminRouter.use('/get-courier',getCourierRouter);
adminRouter.use('/add-cancel-reason',addCancelReason);
adminRouter.use('/update-cancel-reason',updateCancelReason);
adminRouter.use('/delete-cancel-reason',deleteCancelReason);
adminRouter.use('/get-cancel-reason',getCancelReason);

export {adminRouter};