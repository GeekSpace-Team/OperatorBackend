import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {getOrderProductHistoryByOrderId} from "../../../modules/query/delivery-query.mjs";

const getOrderProductHistory = express.Router();

getOrderProductHistory.get('/', (req, res) => {
    if (typeof req.query === 'undefined' || req.query == null) {
        badRequest(req, res);
    } else {
        const {
            order_unique_id
        }=req.query;
        db.query(getOrderProductHistoryByOrderId,[order_unique_id])
            .then(result => {
                res.json(response(false,'success',result.rows));
                res.end();
            })
            .catch(err=>{
                badRequest(req,res);
            });
    }
});

export {getOrderProductHistory};