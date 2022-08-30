import express from 'express';
import { verifyToken } from '../../../modules/auth/token.mjs';
import { db } from '../../../modules/database/connection.mjs';
import { changeOrderProductStatus } from '../../../modules/query/operator-query.mjs';
import { badRequest,response } from '../../../modules/response.mjs';
import {generateUUID} from "../../../modules/uuid/uuid.mjs";

const deleteOrderRouter=express.Router();

deleteOrderRouter.delete('/',verifyToken,(req,res)=>{
    if(req.query != null && typeof req.user !== 'undefined' && req.user != null){
        
    } else {
        badRequest(req,res);
    }
});

export {deleteOrderRouter};