import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import {verifyToken} from "../../../modules/auth/token.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {
    getAllCancelReason, getAllCourier,
    getAllCustomerInterestedProducts,
    getAllCustomers,
    getAllCustomerStatus,
    getAllFocusWord,
    getAllInbox,
    getAllRolePermissions,
    getAllSellPoint,
    getAllSpeakMode,
    getAllSpeakTone,
    getAllUserRole, getAllUsers
} from "../../../modules/query/sync-query.mjs";
import format from "pg-format";

const getAllCustomer = express.Router();

getAllCustomer.get('/', verifyToken,async (req, res) => {
    const unique_id=req.user.user.unique_id;
    const {
        sell_point_id
    } = req.query;
    db.query(`${getAllCustomers} ${getAllCustomerInterestedProducts}
        ${getAllUserRole} ${getAllSpeakTone} ${getAllSpeakMode} ${getAllSellPoint} ${getAllRolePermissions}
        ${format(getAllInbox,unique_id,unique_id)} ${getAllFocusWord}
        ${getAllCustomerStatus} ${format(getAllCancelReason,sell_point_id)}
        ${format(getAllCourier,sell_point_id)} ${format(getAllUsers,sell_point_id)}`)
        .then(results=>{
            res.json(response(false,'success',{
                customers:results[0].rows,
                customers_interested_products:results[1].rows,
                user_role:results[2].rows,
                speak_tone:results[3].rows,
                speak_mode:results[4].rows,
                sell_point:results[5].rows,
                role_permission:results[6].rows,
                inbox:results[7].rows,
                focus_word:results[8].rows,
                customer_status:results[9].rows,
                cancel_reason:results[10].rows,
                courier:results[11].rows,
                users:results[12].rows
            }));
            res.end();
        })
        .catch(err=>{
            console.log(err);
            badRequest(req,res);
        })
})

export {getAllCustomer};