import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {deleteUserRoleQ, deleteUserRoleQuery} from "../../../modules/query/admin-query.mjs";

const deleteUserRole = express.Router();

deleteUserRole.delete('/', async (req, res) => {
    if (typeof req.query === 'undefined' || req.query == null) {
        badRequest(req, res);
    } else {
        const {
            id
        } = req.query;
        db.query(deleteUserRoleQ, [id])
            .then(result => {
                db.query(deleteUserRoleQuery, [id])
                    .then(result2 => {
                        res.json(response(false, 'success', 'success'));
                        res.end();
                    })
                    .catch(err => {
                        badRequest(req, res);
                    })
            })
            .catch(err => {
                badRequest(req, res);
            })
    }
})

export {deleteUserRole};