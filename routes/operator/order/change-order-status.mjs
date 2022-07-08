import express from 'express';
import {verifyToken} from "../../../modules/auth/token.mjs";
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {changeOrderStatus} from "../../../modules/query/operator-query.mjs";

const changeOrderStatusRouter = express.Router();

changeOrderStatusRouter.put('/',verifyToken,(req,res)=>{
    if(typeof req.body === 'undefined'
        || req.body == null
        || typeof req.body.status === 'undefined'
        || typeof req.body.reason === 'undefined'
        || typeof req.body.order_unique_id === 'undefined'){
        badRequest(req,res);
    } else {
        const {status,reason,order_unique_id} = req.body;
        if(status != null){
            db.query(changeOrderStatus,[order_unique_id,status,reason,req.user.user.unique_id])
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
    }
})

export {changeOrderStatusRouter};