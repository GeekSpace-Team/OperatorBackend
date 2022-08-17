import express from 'express';
import { badRequest, response } from "../../../modules/response.mjs";
import { db } from "../../../modules/database/connection.mjs";
import format from "pg-format";
import {
    getCancelReasonQuery
} from "../../../modules/query/delivery-query.mjs";
import { verifyToken } from '../../../modules/auth/token.mjs';
import { generateUUID } from '../../../modules/uuid/uuid.mjs';
const getCancelReasonRouter = express.Router();

getCancelReasonRouter.get('/',verifyToken,(req, res)=>{
    const id = req.query.id;
    console.log(id);
    db.query(getCancelReasonQuery,[id])
    .then(result=>{
        res.json(response(false,'success',result.rows));
        res.end();
    })
    .catch(err=>{
        badRequest(req, res);
    })
})

export {getCancelReasonRouter};