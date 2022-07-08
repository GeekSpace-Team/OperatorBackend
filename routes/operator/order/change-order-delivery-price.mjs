import express from 'express';
import {verifyToken} from "../../../modules/auth/token.mjs";
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {changeOrderDeliveryPrice} from "../../../modules/query/operator-query.mjs";

const changeOrderDeliveryPriceRouter = express.Router();

changeOrderDeliveryPriceRouter.put('/',verifyToken,(req,res)=>{
   if(typeof req.body === 'undefined'){
       badRequest(req,res);
   } else {
       const {order_unique_id,delivery_price,reason}=req.body;
       db.query(changeOrderDeliveryPrice,[order_unique_id,req.user.user.unique_id,delivery_price,reason])
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

export {changeOrderDeliveryPriceRouter};