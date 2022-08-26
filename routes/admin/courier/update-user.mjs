import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {updateCourierQuery} from "../../../modules/query/admin-query.mjs";

const updateCourier = express.Router();

updateCourier.put('/', async (req, res) => {
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
            unique_id
        } = req.body;

        db.query(updateCourierQuery,[
            fullname,
            username,
            password,
            phone_number,
            status,
            user_role,
            sell_point_id,
            work_start_date,
            date_of_birthday,
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
                console.log(err);
                badRequest(req,res);
            })

    }
})

export {updateCourier};