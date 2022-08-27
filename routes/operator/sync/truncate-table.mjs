import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import format from "pg-format";
import {truncateTableQuery} from "../../../modules/query/sync-query.mjs";
import {verifyToken} from "../../../modules/auth/token.mjs";

const truncateTable = express.Router();

truncateTable.post('/', verifyToken,async (req, res) => {
    if (typeof req.body === 'undefined' || req.body == null) {
        badRequest(req, res);
    } else {
        const {
            type
        } = req.body;
        db.query(format(truncateTableQuery,type))
            .then(result=>{
                res.json(response(false,'success','success'));
                res.end();
            })
            .catch(err=>{
                badRequest(req,res);
            })
    }
})

export {truncateTable};