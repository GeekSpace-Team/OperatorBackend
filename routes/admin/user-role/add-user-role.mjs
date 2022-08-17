import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {addUserRolePermissions, addUserRoleQuery} from "../../../modules/query/admin-query.mjs";
import format from "pg-format";

const addUserRole = express.Router();

addUserRole.post('/', async (req, res) => {
    if (typeof req.body === 'undefined' || req.body == null) {
        badRequest(req, res);
    } else {
        const {
            user_role,
            permissions
        } = req.body;

        db.query(addUserRoleQuery, [
            user_role
        ])
            .then(result => {
                if (result.rows.length) {
                    let values = [];
                    permissions.forEach((item, i) => {
                        values.push([
                            item.permission,
                            item.can_read,
                            item.can_write,
                            item.can_edit,
                            item.can_delete,
                            result.rows[0].id, 'now()', 'now()'
                        ]);
                    });
                    db.query(format(addUserRolePermissions, values))
                        .then(result2 => {
                            if (result2.rows.length) {
                                res.json(response(false, 'success', 'success'));
                                res.end();
                            } else {
                                badRequest(req, res);
                            }
                        })
                        .catch(err => {
                            badRequest(req, res);
                        })
                } else {
                    badRequest(req, res);
                }
            })
            .catch(err => {
                badRequest(req, res);
            })

    }
})

export {addUserRole};