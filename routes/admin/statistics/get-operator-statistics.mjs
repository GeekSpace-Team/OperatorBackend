import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import format from "pg-format";
import {getOperatorStatisticsQuery} from "../../../modules/query/admin-query.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {verifyToken} from "../../../modules/auth/token.mjs";

const getOperatorStatistics = express.Router();

getOperatorStatistics.post('/', verifyToken,async (req, res) => {
    if (typeof req.body === 'undefined' || req.body == null) {
        badRequest(req, res);
    } else {
        let whereQuery=``;
        const {
            start_date,
            end_date,
            sell_point_id
        } = req.body;

        if(typeof start_date !== 'undefined' && start_date != null && start_date != ''){
            let endD=new Date("YYYY-MM-DD");
            if(typeof end_date !== 'undefined' && end_date != null && end_date != ''){
                endD = end_date;
            }
            whereQuery=` AND  ((o.created_at,o.created_at) OVERLAPS ('${start_date}'::DATE,'${endD}'::DATE)) `;
        }

        let query=format(getOperatorStatisticsQuery,whereQuery,whereQuery);
        db.query(query,[sell_point_id])
            .then(result=>{
                res.json(response(false,'success',result.rows));
                res.end();
            })
            .catch(err=>{
                console.log(err);
                badRequest(req,res);
            })
    }
})

export {getOperatorStatistics};