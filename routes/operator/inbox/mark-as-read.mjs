import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import {verifyToken} from "../../../modules/auth/token.mjs";
import {db} from "../../../modules/database/connection.mjs";
import { markAsRead} from "../../../modules/query/operator-query.mjs";

const markAsReadRouter = express.Router();

markAsReadRouter.put('/', verifyToken,(req, res) => {
    if(typeof req.body === 'undefined' || req.body == null){
        badRequest(req,res);
    } else {
        const {
            inbox_unique_id
        } = req.body;
        db.query(markAsRead,[inbox_unique_id])
            .then(result=>{
                if(result.rows.length) {
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

export {markAsReadRouter};