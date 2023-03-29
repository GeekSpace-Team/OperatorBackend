import express from "express";
import format from "pg-format";
import { verifyToken } from "../../../modules/auth/token.mjs";
import { db } from "../../../modules/database/connection.mjs";
import { getAllPhoneCalls } from "../../../modules/query/sync-query.mjs";
import { badRequest, response } from "../../../modules/response.mjs";

const getAllCallsRouter = express.Router();

getAllCallsRouter.get('/',verifyToken,(req,res)=>{
    let sell_point_id = req.query.sell_point_id;
    db.query(format(getAllPhoneCalls, sell_point_id))
    .then(result=>{
        res.json(response(false, 'success',result.rows));
    })
    .catch(err=>{
        badRequest(req, res);
    })
})

export default getAllCallsRouter;