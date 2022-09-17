import express from "express";
import format from "pg-format";
import { verifyToken } from "../../../modules/auth/token.mjs";
import { db } from "../../../modules/database/connection.mjs";
import { badRequest, response } from "../../../modules/response.mjs";
import { generateUUID } from "../../../modules/uuid/uuid.mjs";

import {
    getCancelReasonQuery
} from "../../../modules/query/delivery-query.mjs";
const getCancelReasonRouter = express.Router();

getCancelReasonRouter.get('/',verifyToken,(req, res)=>{
    db.query(getCancelReasonQuery)
    .then(result=>{
        res.json(response(false,'success',result.rows));
        res.end();
    })
    .catch(err=>{
        badRequest(req, res);
    })
})

export {getCancelReasonRouter};