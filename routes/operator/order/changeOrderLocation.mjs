import express from 'express';
import {verifyToken} from "../../../modules/auth/token.mjs";
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {changeOrderLocation} from "../../../modules/query/operator-query.mjs";

const changeOrderLocationRouter = express.Router();

changeOrderLocationRouter.put('/',verifyToken,(req,res)=>{
   if(typeof req.body === 'undefined'){
       badRequest(req,res);
   } else {
       const {order_unique_id,latitude,longitude,reason} = req.body;
       db.query(changeOrderLocation,[order_unique_id,req.user.user.unique_id,latitude,longitude,reason])
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

export {changeOrderLocationRouter};