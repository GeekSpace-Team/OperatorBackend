import express from 'express';
import {verifyToken} from "../../../modules/auth/token.mjs";
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {addCourier} from "../../../modules/query/operator-query.mjs";
import {generateUUID} from "../../../modules/uuid/uuid.mjs";

const addCourierRouter = express.Router();


addCourierRouter.post('/',verifyToken,(req,res)=>{
   if(typeof req.body === 'undefined'
       || req.body == null
   ){
       badRequest(req,res);
   } else {
       const {
           fullname,
           username,
           password,
           phone_number,
           status,
           user_role,
           date_of_birthday,
           work_start_date,
           sell_point_id
       } = req.body;

       db.query(addCourier,[
           fullname,
           username,
           password,
           phone_number,
           status,
           user_role,
           date_of_birthday,
           work_start_date,
           sell_point_id,
           generateUUID()
       ]).then(result => {
           if(result.rows.length){
               res.json(response(false,'success',result.rows[0]));
               res.end();
           } else {
               badRequest(req,res);
           }
       }).catch(err => {
           badRequest(req,res);
       })
   }
});

export {addCourierRouter};