import express from 'express';
import { verifyToken } from '../../../modules/auth/token.mjs';
import { db } from '../../../modules/database/connection.mjs';
import { changeOrderProductStatus } from '../../../modules/query/operator-query.mjs';
import { badRequest,response } from '../../../modules/response.mjs';

const editOrderProductStatus = express.Router();

editOrderProductStatus.put('/', verifyToken, (req, res) => {
    if (typeof req.body === 'undefined'
        || req.body == null
        || typeof req.body.order_product_unique_id === 'undefined'
        || typeof req.body.status === 'undefined'
        || typeof req.body.reason === 'undefined') {
        badRequest(req, res);
    } else {
        const {order_product_unique_id,status,reason} = req.body;
        db.query(changeOrderProductStatus,[order_product_unique_id,status,req.user.user.unique_id,reason])
        .then(result=>{
            if(result.rows.length){
                res.json(response(false,'success',result.rows[0]));
                res.end();
            } else {
                badRequest(req,res);
            }
        })
        .catch(err=>{
            badRequest(req,res);
        })
    }
});

export { editOrderProductStatus };