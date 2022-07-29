import express from 'express';
import {verifyToken} from "../../../modules/auth/token.mjs";
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {getCouriersByFilter, getSellPointId} from '../../../modules/query/operator-query.mjs';

const getCouriersBySellIdRouter = express.Router();

getCouriersBySellIdRouter.get('/',verifyToken,(req,res) => {
    if(typeof req.user === 'undefined'){
        badRequest(req,res);
    } else {
        db.query(getSellPointId,[req.user.user.unique_id])
            .then(result=>{
                let sell_point_id = result.rows[0].sell_point_id;
                db.query(getCouriersByFilter,[sell_point_id])
                    .then(result2=>{
                        res.json(response(false,'success',result2.rows));
                        res.end();
                    })
                    .catch(err=>{
                        badRequest(req,res);
                    })
            })
            .catch(err=>{
                badRequest(req,res);
            })
    }
})


export {getCouriersBySellIdRouter};