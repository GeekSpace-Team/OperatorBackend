import express from "express";
import format from "pg-format";
import { verifyToken } from "../../../modules/auth/token.mjs";
import { callDirection } from "../../../modules/constant/constant.mjs";
import { db } from "../../../modules/database/connection.mjs";
import { getAcceptedCall, getAcceptedCallAdmin, getAcceptedCallAdminCount, getAcceptedCallCount, getMissedCall, getSellPointId } from "../../../modules/query/operator-query.mjs";
import { badRequest, response } from "../../../modules/response.mjs";

const acceptedCallAdminRouter=express.Router();
acceptedCallAdminRouter.post('/',verifyToken,async(req,res) => {
    if(typeof req.body === 'undefined' || req.body == null || typeof req.user === 'undefined' || req.user == null){
        badRequest(req,res);
    } else {
        const {startDate,endDate,incoming,outgoing,sortBy,perPage,page}=req.body;
        let whereQuery='';
        let orderByQuery=' ORDER BY p.created_at DESC ';


         await db.query(getSellPointId,[req.user.user.unique_id])
        .then(result_sell_point => {
            let sell_point_id=result_sell_point.rows[0].sell_point_id;
            if(result_sell_point.rows.length && typeof sell_point_id!=='undefined' && sell_point_id!=null && sell_point_id!=''){
                
                whereQuery+=' AND u.sell_point_id = '+sell_point_id;
                console.log(sell_point_id);
            }

            
        })
        .catch(err=>{
            console.log(err);
        })

        if(startDate != null && startDate !== '' && typeof startDate !== 'undefined'){
            let endD=new Date();
            if(endDate != null && endDate !== '' && typeof endDate !== 'undefined' && endDate != 0){
                endD=endDate;
            } else {
                endD=`${endD.getFullYear()}-${endD.getMonth()+1}-${endD.getDate()}`;
            }
            whereQuery += ` AND ((p.call_date,p.call_date) OVERLAPS ('${startDate}'::DATE,'${endD}'::DATE)) `;
        }

        if(incoming){
            whereQuery += ` AND (call_direction = '${callDirection.INCOMING}' ${outgoing?` OR call_direction = '${callDirection.OUTGOING}'`:``}) `;
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



        let query=format(getAcceptedCallAdmin,whereQuery,orderByQuery);
        db.query(query,[perPage,page])
        .then(result=>{
            if(page==1){
                let countQuery=format(getAcceptedCallAdminCount,whereQuery,orderByQuery);
                db.query(countQuery)
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
export {acceptedCallAdminRouter};

// SELECT p.*, COALESCE(c.fullname, '--------') as user_full_name,
// (SELECT COUNT(p3.*) FROM phone_call p3 WHERE p3.phone_number=p.phone_number) AS all_call_history_count,
// (SELECT array_to_json(array_agg(p2.*)) FROM phone_call p2 WHERE p.phone_number=p2.phone_number) AS call_history
// FROM phone_call p 
// LEFT JOIN customer c ON c.phone_number=p.phone_number
// WHERE (p.call_state='3' OR p.call_state='2') AND ((p.call_date,p.call_date) OVERLAPS ('2022-06-18'::DATE,'2022-06-20'::DATE)) ORDER BY user_full_name DESC LIMIT 20 OFFSET (1 - 1) * 20;
