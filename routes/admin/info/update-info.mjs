import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import format from "pg-format";
import {updateInfoQuery} from "../../../modules/query/admin-query.mjs";
import {verifyToken} from "../../../modules/auth/token.mjs";

const updateInfo = express.Router();

updateInfo.put('/', verifyToken,async (req, res) => {
    if (typeof req.body === 'undefined' || req.body == null) {
        badRequest(req, res);
    } else {
        const {
            type,
            value,
            id
        } = req.body;

        db.query(format(updateInfoQuery,type),[value,id])
            .then(result=>{
                if(result.rows.length){
                    res.json(response(false,'success',result.rows[0]));
                    res.end();
                } else {
                    badRequest(req,res);
                }
            })
            .catch(err=>{
                console.log(err);
                badRequest(req,res);
            })

    }
})

export {updateInfo};