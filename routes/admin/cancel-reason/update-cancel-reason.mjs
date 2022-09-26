import express from "express";
import { verifyToken } from "../../../modules/auth/token.mjs";
import { db } from "../../../modules/database/connection.mjs";
import { updateCancelReasonQuery } from "../../../modules/query/admin-query.mjs";
import { badRequest, response } from "../../../modules/response.mjs";

const updateCancelReason = express.Router();

updateCancelReason.put('/',verifyToken, async (req, res) => {
    if (typeof req.body === 'undefined' || req.body == null) {
        badRequest(req, res);
    } else {
        const {
            value,
            unique_id
        } = req.body;
        db.query(updateCancelReasonQuery,[null,value,unique_id])
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


export {updateCancelReason};