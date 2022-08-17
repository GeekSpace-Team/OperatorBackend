import express from 'express';
import { verifyToken } from '../../../modules/auth/token.mjs';
import { db } from '../../../modules/database/connection.mjs';
import { badRequest,response } from '../../../modules/response.mjs';
import format from 'pg-format';
import { getMissedCall, getMissedCallCount } from '../../../modules/query/operator-query.mjs';
import { callDirection } from '../../../modules/constant/constant.mjs';

const missedCallRouter=express.Router();
missedCallRouter.post('/',verifyToken,(req,res) => {
    if(typeof req.body === 'undefined' || req.body == null || typeof req.user === 'undefined' || req.user == null){
        badRequest(req,res);
    } else {
        const {startDate,endDate,incoming,outgoing,sortBy,perPage,page}=req.body;
        let whereQuery='';
        let orderByQuery=' ORDER BY p.created_at DESC ';

        if(startDate != null && startDate != '' && typeof startDate !== 'undefined'){
            let endD=new Date("YYYY-MM-DD");
            if(endDate != null && endDate != '' && typeof endDate !== 'undefined'){
                endD=endDate;
            }
            whereQuery += ` AND ((p.call_date,p.call_date) OVERLAPS ('${startDate}'::DATE,'${endDate}'::DATE)) `;
        }

        if(incoming){
            whereQuery += ` AND (call_direction = '${callDirection.INCOMING}') `;
        } else if(outgoing){
            whereQuery += ` AND (call_direction = '${callDirection.OUTGOING}') `;
        }

        if(typeof sortBy !== 'undefined' && sortBy !=null){
            switch(sortBy){
                case 0:
                    orderByQuery=' ORDER BY p.created_at DESC ';
                    break;
                case 1:
                    orderByQuery=' ORDER BY p.created_at ASC ';
                    break;
                case 2:
                    orderByQuery=' ORDER BY user_full_name ';
                    break;
                case 3:
                    orderByQuery=' ORDER BY user_full_name DESC';
                    break;
            }
        }



        let query=format(getMissedCall,whereQuery,orderByQuery);
        db.query(query,[req.user.user.unique_id,perPage,page])
        .then(result=>{
            if(page==1){
                let countQuery=format(getMissedCallCount,whereQuery,orderByQuery);
                db.query(countQuery,[req.user.user.unique_id])
                .then(result_count=>{
                    let page_count = Math.ceil(result_count.rows.length/perPage);
                    if(page_count <= 0){
                        page_count = 1;
                    }
                    res.json(response(false,'success',{calls:result.rows,page_count:page_count}));
                    res.end();
                })
                .catch(err=>{
                    console.log(err);
                    res.json(response(false,'success',{calls:result.rows,page_count:0}));
                    res.end();
                })
            } else {
                res.json(response(false,'success',{calls:result.rows,page_count:0}));
                res.end();
            }
            
        })
        .catch(err=>{
            badRequest(req,res);
            console.log(err+'');
        });
    }
});
export {missedCallRouter};

// SELECT p.*, COALESCE(c.fullname, '--------') as user_full_name,
// (SELECT COUNT(p3.*) FROM phone_call p3 WHERE p3.phone_number=p.phone_number) AS all_call_history_count,
// (SELECT array_to_json(array_agg(p2.*)) FROM phone_call p2 WHERE p.phone_number=p2.phone_number) AS call_history
// FROM phone_call p 
// LEFT JOIN customer c ON c.phone_number=p.phone_number
// WHERE (p.call_state='3' OR p.call_state='2') AND ((p.call_date,p.call_date) OVERLAPS ('2022-06-18'::DATE,'2022-06-20'::DATE)) ORDER BY user_full_name DESC LIMIT 20 OFFSET (1 - 1) * 20;
