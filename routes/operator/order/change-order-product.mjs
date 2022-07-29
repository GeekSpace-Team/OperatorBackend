import express from 'express';
import {verifyToken} from "../../../modules/auth/token.mjs";
import {badRequest, response} from "../../../modules/response.mjs";
import {generateUUID} from "../../../modules/uuid/uuid.mjs";
import {db} from "../../../modules/database/connection.mjs";
import format from "pg-format";
import {addOrderProduct, getCourierUniqueId} from "../../../modules/query/operator-query.mjs";
import {sendMessage} from "../../../modules/push/push.mjs";

const changeOrderProductRouter = express.Router();

changeOrderProductRouter.put('/',verifyToken,async(req,res)=>{
   if(typeof req.body === 'undefined' || req.body == null){
       badRequest(req,res);
   } else {
       const {order_unique_id,products}=req.body;
       let values = [];
       if (typeof products !== 'undefined' && products != null) {
           products.forEach(product => {
               values.push([
                       order_unique_id,
                       product.product_name,
                       product.product_brand,
                       product.product_model,
                       product.product_artikul_code,
                       product.product_debt_price,
                       product.product_cash_price,
                       product.product_discount,
                       product.product_size,
                       product.product_color,
                       product.product_count,
                       generateUUID(),
                       'now()',
                       'now()',
                       '',
                       req.user.user.unique_id
                   ]
               );
           });
           await db.query(format(addOrderProduct, values))
               .then(async result => {
                   if (result.rows.length) {
                       await db.query(getCourierUniqueId,[order_unique_id])
                           .then(async result_courier=>{
                               if(result_courier.rows.length){
                                   await sendMessage(result_courier.rows[0].courier_unique_id,
                                       `Sargyda täze haryt goşuldy!`,
                                       `Täze goşulan haryt sany ${products.length}`,
                                       {
                                           order_unique_id:order_unique_id,
                                           courier_unique_id:result_courier.rows[0].courier_unique_id,
                                           user_unique_id:req.user.user.unique_id
                                       });
                               }
                           })
                           .catch(err=>{})
                       res.json(response(false,'success',result.rows));
                   } else {
                       badRequest(req,res);
                   }
               })
               .catch(err => {
                   console.log(err);
                   badRequest(req,res);
               });
       }
   }
});

export {changeOrderProductRouter};