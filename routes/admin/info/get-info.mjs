import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {getInfoQuery} from "../../../modules/query/admin-query.mjs";
import format from "pg-format";
import {verifyToken} from "../../../modules/auth/token.mjs";

const getInfo = express.Router();

getInfo.get('/', verifyToken,async (req, res) => {
    if (typeof req.query === 'undefined' || req.query == null) {
        badRequest(req, res);
    } else {
        const {
            type
        } = req.query;

        db.query(format(getInfoQuery,type))
            .then(result=>{
                res.json(response(false,'success',result.rows));
                res.end();
            })
            .catch(err=>{
                badRequest(req,res);
            })

    }
})

export {getInfo};