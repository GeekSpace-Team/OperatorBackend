import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {updateSellPointQuery} from "../../../modules/query/admin-query.mjs";

const updateSellPoint = express.Router();

updateSellPoint.put('/', async (req, res) => {
    if (typeof req.body === 'undefined' || req.body == null) {
        badRequest(req, res);
    } else {
        const {
            name, address, phone_number, latitude, longitude,unique_id
        } = req.body;
        db.query(updateSellPointQuery,[
            name, address, phone_number, latitude, longitude,unique_id
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
})

export {updateSellPoint};