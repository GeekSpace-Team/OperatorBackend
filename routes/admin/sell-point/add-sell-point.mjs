import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {addSellPointQuery} from "../../../modules/query/admin-query.mjs";
import {generateUUID} from "../../../modules/uuid/uuid.mjs";

const addSellPoint = express.Router();

addSellPoint.post('/', async (req, res) => {
    if (typeof req.body === 'undefined' || req.body == null) {
        badRequest(req, res);
    } else {
        const {
            name, address, phone_number, latitude, longitude
        } = req.body;
        db.query(addSellPointQuery,[
            name, address, phone_number, latitude, longitude,generateUUID()
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

export {addSellPoint};