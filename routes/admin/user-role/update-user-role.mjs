import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {
    addUserRolePermissions,
    addUserRoleQuery,
    deleteUserRoleQuery,
    updateUserRoleQuery
} from "../../../modules/query/admin-query.mjs";
import format from "pg-format";
import {verifyToken} from "../../../modules/auth/token.mjs";

const updateUserRole = express.Router();

updateUserRole.put('/', verifyToken,async (req, res) => {
    if (typeof req.body === 'undefined' || req.body == null) {
        badRequest(req, res);
    } else {
        const {
            user_role,
            id,
            permissions
        } = req.body;

        db.query(updateUserRoleQuery, [
            user_role,
            id
        ])
            .then(async result => {
                if (result.rows.length) {
                    let values = [];
                    permissions.forEach((item, i) => {
                        values.push([
                            item.permission,
                            item.can_read,
                            item.can_write,
                            item.can_edit,
                            item.can_delete,
                            id, 'now()', 'now()'
                        ]);
                    });
                    await db.query(deleteUserRoleQuery,[id])
                        .then(result=>{})
                        .catch(err=>{})
                    await db.query(format(addUserRolePermissions, values))
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

export {updateUserRole};