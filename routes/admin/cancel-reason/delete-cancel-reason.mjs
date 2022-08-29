import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {deleteCancelReasonQuery} from "../../../modules/query/admin-query.mjs";
import {verifyToken} from "../../../modules/auth/token.mjs";

const deleteCancelReason = express.Router();

deleteCancelReason.delete('/',verifyToken, async (req, res) => {
    if (typeof req.query === 'undefined' || req.query == null) {
        badRequest(req, res);
    } else {
        const {
            unique_id
        } = req.query;
        db.query(deleteCancelReasonQuery,[unique_id])
            .then(result=>{
                res.json(response(false,'success','success'));
                res.end();
            })
            .catch(err=>{
                badRequest(req,res);
            })
    }
})

export {deleteCancelReason};