import express from 'express';
import {verifyToken} from "../../../modules/auth/token.mjs";
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import { getOrderProductHistory } from '../../../modules/query/operator-query.mjs';
import format from 'pg-format';

const getOrderProductStatusRouter = express.Router();

getOrderProductStatusRouter.post('/',verifyToken,(req,res) => {
    if(typeof req.body === 'undefined'){
        badRequest(req,res);
    } else {
        const {ids}=req.body;
        db.query(format(getOrderProductHistory,ids))
        .then(result=>{
            res.json(response(false,'success',result.rows));
        })
        .catch(err=>{
            badRequest(req,res);
        })
    }
});

export {getOrderProductStatusRouter};