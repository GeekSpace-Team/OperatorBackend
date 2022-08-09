import express from 'express';
import {verifyToken} from "../../../modules/auth/token.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {getAllCustomer} from "../../../modules/query/operator-query.mjs";
import {badRequest, response} from "../../../modules/response.mjs";

const getAllCustomerRouter=express.Router();

getAllCustomerRouter.get('/',verifyToken,(req,res)=>{
    db.query(getAllCustomer)
        .then(result=>{
            res.json(response(false,'success',result.rows));
            res.end();
        })
        .catch(err=>{
            badRequest(req,res);
        })
});


export {getAllCustomerRouter};