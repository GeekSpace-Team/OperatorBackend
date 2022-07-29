import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import {verifyToken} from "../../../modules/auth/token.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {getUnReadInboxCountQuery} from "../../../modules/query/operator-query.mjs";

const getUnreadInboxCount = express.Router();

getUnreadInboxCount.get('/', verifyToken,(req, res) => {
    db.query(getUnReadInboxCountQuery,[req.user.user.unique_id])
        .then(result=>{
            res.json(response(false,'success',result.rows[0]));
            res.end();
        })
        .catch(err=>{
            badRequest(req,res);
        })
});

export {getUnreadInboxCount};