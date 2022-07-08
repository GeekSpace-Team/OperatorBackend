import express from 'express';
import { verifyToken } from '../../../modules/auth/token.mjs';
import { db } from '../../../modules/database/connection.mjs';
import { getField } from '../../../modules/query/operator-query.mjs';
import { badRequest,response } from '../../../modules/response.mjs';

const getFieldRouter = express.Router();


getFieldRouter.get('/',verifyToken,(req,res) => {
    if(typeof req.user === 'undefined' || req.user==null){
        badRequest(req,res);
    } else {
        db.query(getField)
        .then(result=>{
            res.json(response(false,'success',result.rows[0]));
        })
        .catch(err=>{
            badRequest(req,res);
        })
    }
})


export {getFieldRouter};