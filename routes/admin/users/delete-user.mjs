import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {deleteUserQuery} from "../../../modules/query/admin-query.mjs";

const deleteUser = express.Router();

deleteUser.delete('/', async (req, res) => {
    if (typeof req.query === 'undefined' || req.query == null) {
        badRequest(req, res);
    } else {
        db.query(deleteUserQuery,[req.query.unique_id])
            .then(result=>{
                res.json(response(false,'success','success'));
                res.end();
            })
            .catch(err=>{
                badRequest(req,res);
            })
    }
})

export {deleteUser};