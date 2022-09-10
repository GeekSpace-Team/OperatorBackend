import express from 'express';
import { badRequest, response } from "../../../modules/response.mjs";
import { verifyToken } from "../../../modules/auth/token.mjs";
import { db } from "../../../modules/database/connection.mjs";
import format from "pg-format";
import { checkIds } from "../../../modules/query/sync-query.mjs";

const checkByUniqueId = express.Router();

checkByUniqueId.post('/', verifyToken, async (req, res) => {
    if (typeof req.body === 'undefined' || req.body == null) {
        badRequest(req, res);
    } else {
        const {
            ids,
            type
        } = req.body;
        db.query(format(checkIds, type, ids))
            .then(async result => {

                let data = {
                    ids: result.rows,
                    type: type
                };
                res.json(response(false, 'success', data));
                res.end();
            })
            .catch(err => {
                console.log(err);
                badRequest(req, res);
            })

    }
})

export { checkByUniqueId };