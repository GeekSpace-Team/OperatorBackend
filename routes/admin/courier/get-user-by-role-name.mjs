import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {getCouriersQuery, getUsersByRoleNameQuery} from "../../../modules/query/admin-query.mjs";

const getCourierRouter = express.Router();

getCourierRouter.get('/', async (req, res) => {
    if (typeof req.query === 'undefined' || req.query == null) {
        badRequest(req, res);
    } else {
        db.query(getCouriersQuery)
            .then(result=>{
                res.json(response(false,'success',result.rows));
                res.end();
            })
            .catch(err=>{
                badRequest(req,res);
            })
    }
})

export {getCourierRouter};