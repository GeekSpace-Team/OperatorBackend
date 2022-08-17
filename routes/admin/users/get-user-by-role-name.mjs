import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {getUsersByRoleNameQuery} from "../../../modules/query/admin-query.mjs";

const getUserByRoleName = express.Router();

getUserByRoleName.get('/', async (req, res) => {
    if (typeof req.query === 'undefined' || req.query == null) {
        badRequest(req, res);
    } else {
        db.query(getUsersByRoleNameQuery,[req.query.role])
            .then(result=>{
                res.json(response(false,'success',result.rows));
                res.end();
            })
            .catch(err=>{
                badRequest(req,res);
            })
    }
})

export {getUserByRoleName};