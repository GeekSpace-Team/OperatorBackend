import express from 'express';
import format from 'pg-format';
import { verifyToken } from '../../../modules/auth/token.mjs';
import { db } from '../../../modules/database/connection.mjs';
import { getCustomers, getCustomersPageCount } from '../../../modules/query/operator-query.mjs';
import { badRequest,response } from '../../../modules/response.mjs';


const getCustomerRouter = express.Router();

getCustomerRouter.post('/',verifyToken,(req, res) => {
    if(typeof req.user === 'undefined' || req.user === null){
        badRequest(req,res);
    } else {
        const {startDate,endDate,status,sortBy,perPage,page,search}=req.body;
        let whereQuery='';
        let orderByQuery=' ORDER BY c.created_at DESC ';

        if(startDate != null && startDate != '' && typeof startDate !== 'undefined'){
            let endD=new Date();
            if(endDate != null && endDate !== '' && typeof endDate !== 'undefined' && endDate != 0){
                endD=endDate;
            } else {
                endD=`${endD.getFullYear()}-${endD.getMonth()+1}-${endD.getDate()}`;
            }
            if(whereQuery!=''){
                whereQuery+=" AND ";
            } else {
                whereQuery+=" WHERE ";
            }
            whereQuery += ` ((c.created_at,c.created_at) OVERLAPS ('${startDate}'::DATE,'${endD}'::DATE)) `;
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

        if(typeof status !== 'undefined' && status != null && status > 0){
            if(whereQuery!=''){
                whereQuery+=" AND ";
            } else {
                whereQuery+=" WHERE ";
            }
            whereQuery += ` (c.status = ${status}) `;
        }


        if(typeof search !== 'undefined' && search != null && search != ''){
            if(whereQuery!=''){
                whereQuery+=" AND ";
            } else {
                whereQuery+=" WHERE ";
            }
            whereQuery += ` (c.fullname ILIKE '%${search}%' OR c.phone_number ILIKE '%${search}%' OR c.address_home ILIKE '%${search}%' OR c.address_work ILIKE '%${search}%' OR c.information ILIKE '%${search}%') `;
        }




        let query = format(getCustomers,whereQuery,orderByQuery);

        console.log(query);

        db.query(query,[perPage,page])
        .then(result=>{
            if(page==1){
                let countQuery=format(getCustomersPageCount,whereQuery,orderByQuery);
                db.query(countQuery)
                .then(result_count=>{
                    let page_count = Math.ceil(result_count.rows.length/perPage);
                    if(page_count <= 0){
                        page_count = 1;
                    }
                    res.json(response(false,'success',{customers:result.rows,page_count:page_count}));
                    res.end();
                })
                .catch(err=>{
                    console.log(err);
                    res.json(response(false,'success',{customers:result.rows,page_count:0}));
                    res.end();
                })
            } else {
                res.json(response(false,'success',{customers:result.rows,page_count:0}));
                res.end();
            }
        })
        .catch(err=>{
            badRequest(req,res);
        })


    }
});


export {getCustomerRouter};