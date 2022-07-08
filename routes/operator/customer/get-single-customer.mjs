import express from "express";
import { verifyToken } from "../../../modules/auth/token.mjs";
import { db } from "../../../modules/database/connection.mjs";
import { getSingleCustomerQuery } from "../../../modules/query/operator-query.mjs";
import { badRequest, response } from "../../../modules/response.mjs";

const getSingleCustomer = express.Router();

getSingleCustomer.get("/", verifyToken, (req, res) => {
    if (typeof req.user === "undefined" || req.user == null) {
        badRequest(req, res);
    } else {
        db.query(getSingleCustomerQuery, [req.query.id])
            .then((result) => {
                if (result.rows.length) {
                    res.json(response(false, "success", result.rows[0]));
                    res.end();
                } else {
                    badRequest(req, res);
                }
            })
            .catch((err) => {
                badRequest(req, res);
            });
    }
});

export { getSingleCustomer };
