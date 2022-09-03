import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {
    getAllCustomerOrderAddress,
    getAllCustomerOrders,
    getAllOrderCourier,
    getAllOrderDate,
    getAllOrderDelivery,
    getAllOrderLocation,
    getAllOrderProduct,
    getAllOrderProductStatus, getAllOrderStatus
} from "../../../modules/query/sync-query.mjs";
import {verifyToken} from "../../../modules/auth/token.mjs";
import format from 'pg-format';
import { getSellPointId } from '../../../modules/query/operator-query.mjs';

const getAllOrders = express.Router();

getAllOrders.get('/', verifyToken,async (req, res) => {
    let sell_point_id=req.query.sell_point_id;
    console.log(sell_point_id);
    await db.query(`${format(getAllCustomerOrders,sell_point_id)} ${format(getAllCustomerOrderAddress,sell_point_id)}
                ${format(getAllOrderCourier,sell_point_id)} ${format(getAllOrderDate,sell_point_id)}
                ${format(getAllOrderDelivery,sell_point_id)} ${format(getAllOrderLocation,sell_point_id)}
                ${format(getAllOrderProduct,sell_point_id)} ${format(getAllOrderProductStatus,sell_point_id)}
                ${format(getAllOrderStatus,sell_point_id)}`)
        .then(results=>{
            res.json(response(false,'success',{
                orders:results[0].rows,
                address:results[1].rows,
                courier:results[2].rows,
                dates:results[3].rows,
                delivery_price:results[4].rows,
                location:results[5].rows,
                products:results[6].rows,
                product_status:results[7].rows,
                order_status:results[8].rows
            }));
            res.end();
        })
        .catch(err=>{
            console.log(err);
            badRequest(req,res);
        })
})

export {getAllOrders};