import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {addCancelReasonQuery} from "../../../modules/query/admin-query.mjs";
import {generateUUID} from "../../../modules/uuid/uuid.mjs";
import {verifyToken} from "../../../modules/auth/token.mjs";

const addCancelReason = express.Router();

addCancelReason.post('/',verifyToken, async (req, res) => {
    if (typeof req.body === 'undefined' || req.body == null) {
        badRequest(req, res);
    } else {
        const {
            sell_point_id,
            value
        } = req.body;

        db.query(addCancelReasonQuery,[generateUUID(),sell_point_id,value])
            .then(result=>{
                if(result.rows.length){
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
})

export {addCancelReason};