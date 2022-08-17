import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {getSellPointQuery} from "../../../modules/query/admin-query.mjs";
import {verifyToken} from "../../../modules/auth/token.mjs";

const getSellPoint = express.Router();

getSellPoint.get('/', verifyToken,async (req, res) => {
    if (typeof req.body === 'undefined' || req.body == null) {
        badRequest(req, res);
    } else {
        db.query(getSellPointQuery)
            .then(result=>{
                res.json(response(false,'success',result.rows));
                res.end();
            })
            .catch(err=>{
                badRequest(req,res);
            })
    }
})

export {getSellPoint};