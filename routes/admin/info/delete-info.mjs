import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import format from "pg-format";
import {deleteInfoQuery} from "../../../modules/query/admin-query.mjs";
import {verifyToken} from "../../../modules/auth/token.mjs";

const deleteInfo = express.Router();

deleteInfo.delete('/', verifyToken, async (req, res) => {
    if (typeof req.query === 'undefined' || req.query == null) {
        badRequest(req, res);
    } else {
        const {
            id,
            type
        } = req.query;

        db.query(format(deleteInfoQuery, type), [id])
            .then(result => {
                res.json(response(false, 'success', 'success'));
                res.end();
            })
            .catch(err => {
                badRequest(req, res);
            })
    }
})

export {deleteInfo};