import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import {verifyToken} from "../../../modules/auth/token.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {addUserQuery} from "../../../modules/query/admin-query.mjs";
import {generateUUID} from "../../../modules/uuid/uuid.mjs";

const addUser = express.Router();

addUser.post('/', verifyToken,async (req, res) => {
    if (typeof req.body === 'undefined' || req.body == null) {
        badRequest(req, res);
    } else {
        const {
            fullname,
            username,
            password,
            phone_number,
            status,
            user_role,
            sell_point_id,
            work_start_date,
            date_of_birthday,
            user_number
        } = req.body;

        db.query(addUserQuery,[
            fullname,
            username,
            password,
            phone_number,
            status,
            user_role,
            sell_point_id,
            '',
            work_start_date,
            date_of_birthday, generateUUID(), user_number
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
                console.log(err);
                badRequest(req,res);
            })
    }
})

export {addUser};