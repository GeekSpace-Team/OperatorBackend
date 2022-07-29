import express from 'express';
import {verifyToken} from "../../../modules/auth/token.mjs";
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {deleteInbox} from "../../../modules/query/operator-query.mjs";

const removeInbox = express.Router();

removeInbox.put('/',verifyToken,(req,res)=>{
    if(typeof req.body === 'undefined' || req.body == null){
        badRequest(req,res);
    } else {
        const {
            inbox_unique_id
        } = req.body;
        db.query(deleteInbox,[inbox_unique_id])
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

export {removeInbox};