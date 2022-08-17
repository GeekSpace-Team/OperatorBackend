import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {deleteSellPointQuery} from "../../../modules/query/admin-query.mjs";

const deleteSellPoint = express.Router();

deleteSellPoint.delete('/', async (req, res) => {
    if (typeof req.query === 'undefined' || req.query == null) {
        badRequest(req, res);
    } else {
        db.query(deleteSellPointQuery,[req.query.unique_id])
            .then(result=>{
                res.json(response(false,'success','success'));
                res.end();
            })
            .catch(err=>{
                console.log(err);
                badRequest(req,res);
            })
    }
})

export {deleteSellPoint};