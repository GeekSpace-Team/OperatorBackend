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

const getAllOrders = express.Router();

getAllOrders.get('/', verifyToken,async (req, res) => {
    db.query(`${getAllCustomerOrders} ${getAllCustomerOrderAddress}
                ${getAllOrderCourier} ${getAllOrderDate}
                ${getAllOrderDelivery} ${getAllOrderLocation}
                ${getAllOrderProduct} ${getAllOrderProductStatus}
                ${getAllOrderStatus}`)
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