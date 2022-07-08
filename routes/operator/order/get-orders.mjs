import express from 'express';
import format from 'pg-format';
import { verifyToken } from '../../../modules/auth/token.mjs';
import { db } from '../../../modules/database/connection.mjs';
import { getCustomers, getCustomersPageCount, getOrders, getOrdersCount } from '../../../modules/query/operator-query.mjs';
import { badRequest,response } from '../../../modules/response.mjs';

const getOrdersRouter = express.Router();

getOrdersRouter.post('/',verifyToken,(req,res) => {
    if(typeof req.user === 'undefined' || req.user === null){
        badRequest(req,res);
    } else {
        const {startDate,endDate,sortBy,perPage,page}=req.body;
        let whereQuery=' WHERE c.operator_unique_id = $1 ';
        let orderByQuery=' ORDER BY c.created_at DESC ';

        if(startDate != null && startDate != '' && typeof startDate !== 'undefined'){
            let endD=new Date("YYYY-MM-DD");
            if(endDate != null && endDate != '' && typeof endDate !== 'undefined'){
                endD=endDate;
            }
            whereQuery += ` AND ((c.created_at,c.created_at) OVERLAPS ('${startDate}'::DATE,'${endDate}'::DATE)) `;
        }

        if(typeof sortBy !== 'undefined' && sortBy !=null){
            switch(sortBy){
                case 0:
                    orderByQuery=' ORDER BY c.created_at DESC ';
                    break;
                case 1:
                    orderByQuery=' ORDER BY c.created_at ASC ';
                    break;
                case 2:
                    orderByQuery=' ORDER BY c.fullname ';
                    break;
                case 3:
                    orderByQuery=' ORDER BY c.fullname DESC';
                    break;
            }
        }

        let query = format(getOrders,whereQuery,orderByQuery);

        db.query(query,[req.user.user.unique_id,perPage,page])
        .then(result=>{
            if(page==1){
                let countQuery=format(getOrdersCount,whereQuery,orderByQuery);
                db.query(countQuery,[req.user.user.unique_id])
                .then(result_count=>{
                    let page_count = Math.round(result_count.rows.length/perPage);
                    if(page_count <= 0){
                        page_count = 1;
                    }
                    res.json(response(false,'success',{orders:result.rows,page_count:page_count}));
                    res.end();
                })
                .catch(err=>{
                    console.log(err);
                    res.json(response(false,'success',{orders:result.rows,page_count:0}));
                    res.end();
                })
            } else {
                res.json(response(false,'success',{orders:result.rows,page_count:0}));
                res.end();
            }
        })
        .catch(err=>{
            badRequest(req,res);
        })



    }
})

export {getOrdersRouter};