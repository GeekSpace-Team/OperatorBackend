import express from 'express';
import {verifyToken} from "../../../modules/auth/token.mjs";
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {changeOrderAddress} from "../../../modules/query/operator-query.mjs";

const changeOrderAddressRouter = express.Router();

changeOrderAddressRouter.put('/',verifyToken,(req,res)=>{
    if(typeof req.body === 'undefined'){
        badRequest(req,res);
    } else {
        const {order_unique_id,address,reason} = req.body;
        db.query(changeOrderAddress,[order_unique_id,address,req.user.user.unique_id,reason])
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
})

export {changeOrderAddressRouter};