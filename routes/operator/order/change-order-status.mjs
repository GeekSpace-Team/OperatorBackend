import express from 'express';
import {verifyToken} from "../../../modules/auth/token.mjs";
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {changeOrderStatus, getCourierUniqueId} from "../../../modules/query/operator-query.mjs";
import {sendMessage} from "../../../modules/push/push.mjs";

const changeOrderStatusRouter = express.Router();

changeOrderStatusRouter.put('/',verifyToken,(req,res)=>{
    if(typeof req.body === 'undefined'
        || req.body == null
        || typeof req.body.status === 'undefined'
        || typeof req.body.reason === 'undefined'
        || typeof req.body.order_unique_id === 'undefined'){
        badRequest(req,res);
    } else {
        const {status,reason,order_unique_id} = req.body;
        if(status != null){
            db.query(changeOrderStatus,[order_unique_id,status,reason,req.user.user.unique_id])
                .then(async result=>{
                    if(result.rows.length){
                        await db.query(getCourierUniqueId,[order_unique_id])
                            .then(async result_courier=>{
                                if(result_courier.rows.length){
                                    await sendMessage(result_courier.rows[0].courier_unique_id,
                                        `Sargydyň statusy üýtgedi!`,
                                        `Täze status: ${status}, ${reason}`,
                                        {
                                            order_unique_id:order_unique_id,
                                            courier_unique_id:result_courier.rows[0].courier_unique_id,
                                            user_unique_id:req.user.user.unique_id
                                        });
                                }
                            })
                            .catch(err=>{})
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
    }
})

export {changeOrderStatusRouter};