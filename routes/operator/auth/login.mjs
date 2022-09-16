import express from "express";
import jwt from "jsonwebtoken";
import { loginType, secret_key } from "../../../modules/constant/constant.mjs";
import { db } from "../../../modules/database/connection.mjs";
import { fcmTokenInsert, insertLoginHistory, loginQuery, updateToken } from "../../../modules/query/operator-query.mjs";
import { badRequest, response } from "../../../modules/response.mjs";
import { generateUUID } from "../../../modules/uuid/uuid.mjs";

const loginRouter = express.Router();
loginRouter.post('/sign-in',async(req,res)=>{
    if(typeof req.body === 'undefined' || req.body == null){
        badRequest(req,res);
    } else {
        db.query(loginQuery,[req.body.username,req.body.password])
        .then(result=>{
            if(result.rows.length){
                const user = {
                    unique_id: result.rows[0].unique_id,
                    user_role: result.rows[0].role_name
                };
                jwt.sign({user},secret_key,async (err,token)=>{
                    if(err) badRequest(req,res);
                    const uid=generateUUID();
                    await db.query(insertLoginHistory,[uid,user.unique_id,loginType.LOGIN,req.body.device])
                    .then(result=>{})
                    .catch(err=>{});
                    await db.query(fcmTokenInsert,[req.body.fcmToken,result.rows[0].user_role,user.unique_id])
                    .then(result=>{})
                    .catch(err=>{});
                    await db.query(updateToken,[token,user.unique_id])
                    .then(result2=>{
                        if(result2.rows.length){
                            result.rows[0].token=token;
                            res.json(response(false,"success",result.rows[0]));
                            res.end();
                        } else {
                            badRequest(req,res);
                        }
                    })
                    .catch(err=>{
                        console.log(err);
                        badRequest(req,res);
                    })
                })
            } else {
                badRequest(req,res);
            }
        })
        .catch(err=>{
            console.log(err+"");
            badRequest(req,res);
        })
    }
});
export {loginRouter};