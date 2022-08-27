import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import {verifyToken} from "../../../modules/auth/token.mjs";
import {getOrderByStatusQuery} from "../../../modules/query/delivery-query.mjs";
import {db} from "../../../modules/database/connection.mjs";

const getOrderByStatus = express.Router();

getOrderByStatus.get('/', verifyToken,(req, res) => {
    if (typeof req.query === 'undefined' || req.query == null) {
        badRequest(req, res);
    } else {
        const {
            status,
            user_id
        } = req.query;
        db.query(getOrderByStatusQuery,[status,user_id])
            .then(result=>{
                res.json(response(false,'success',result.rows));
                res.end();
            })
            .catch(err=>{
                badRequest(req,res);
            })
    }
});

export {getOrderByStatus};