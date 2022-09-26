import express from "express";
import { verifyToken } from "../../../modules/auth/token.mjs";
import { db } from "../../../modules/database/connection.mjs";
import { getCouriersByFilter, getCouriersByFilter2, getSellPointId } from "../../../modules/query/operator-query.mjs";
import { badRequest, response } from "../../../modules/response.mjs";

const getCouriersBySellIdRouter = express.Router();

getCouriersBySellIdRouter.get('/',verifyToken,(req,res) => {
    if(typeof req.user === 'undefined'){
        badRequest(req,res);
    } else {
        db.query(getSellPointId,[req.user.user.unique_id])
            .then(result=>{
                let sell_point_id = result.rows[0].sell_point_id;
                if(typeof sell_point_id!=='undefined' && sell_point_id!=null && sell_point_id!=''){
                    db.query(getCouriersByFilter,[sell_point_id])
                    .then(result2=>{
                        res.json(response(false,'success',result2.rows));
                        res.end();
                    })
                    .catch(err=>{
                        badRequest(req,res);
                    })
                } else {
                    db.query(getCouriersByFilter2)
                    .then(result2=>{
                        res.json(response(false,'success',result2.rows));
                        res.end();
                    })
                    .catch(err=>{
                        badRequest(req,res);
                    })
                }
            })
            .catch(err=>{
                badRequest(req,res);
            })
    }
})


export {getCouriersBySellIdRouter};