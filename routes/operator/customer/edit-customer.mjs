import express from 'express';
import { verifyToken } from '../../../modules/auth/token.mjs';
import { db } from '../../../modules/database/connection.mjs';
import { editCustomer } from '../../../modules/query/operator-query.mjs';
import { badRequest,response } from '../../../modules/response.mjs';

const editCustomerRouter = express.Router();

editCustomerRouter.put('/',verifyToken,(req,res)=>{
    if(typeof req.body === 'undefined' || req.body == null || typeof req.user === 'undefined' || req.user==null){
        badRequest(req,res);
    } else {
        const {
            fullname,
            question_mode,
            find_us,
            address_home,
            address_work,
            information,
            speak_mode,
            status,
            speak_tone,
            speak_accent,
            focus_word,
            unique_id
        }=req.body;

        db.query(editCustomer,[
            fullname,
            question_mode,
            find_us,
            address_home,
            address_work,
            information,
            req.user.user.unique_id,
            speak_mode,
            status,
            speak_tone,
            speak_accent,
            focus_word,
            unique_id
        ])
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
});

export {editCustomerRouter};