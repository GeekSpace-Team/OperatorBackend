import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import {verifyToken} from "../../../modules/auth/token.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {getStatisticsQuery} from "../../../modules/query/admin-query.mjs";
import format from "pg-format";

const getStatistics = express.Router();

getStatistics.post('/',verifyToken,async (req, res) => {
    if (typeof req.body === 'undefined' || req.body == null) {
        badRequest(req, res);
    } else {
        let whereQuery=``;
        const {
            start_date,
            end_date
        } = req.body;

        if(typeof start_date !== 'undefined' && start_date != null && start_date != ''){
            let endD=new Date("YYYY-MM-DD");
            if(typeof end_date !== 'undefined' && end_date != null && end_date != ''){
                endD = end_date;
            }
            whereQuery=` AND  ((o.created_at,o.created_at) OVERLAPS ('${start_date}'::DATE,'${endD}'::DATE)) `;
        }
        db.query(format(getStatisticsQuery,whereQuery,whereQuery))
            .then(result=>{
                res.json(response(false,'success',result.rows));
                res.end();
            })
            .catch(err=>{
                console.error(err);
                badRequest(req,res);
            })
    }
})

export {getStatistics};