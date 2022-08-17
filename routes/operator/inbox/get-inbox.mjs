import express from 'express';
import {verifyToken} from "../../../modules/auth/token.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {getInboxCountQuery, getInboxQuery} from "../../../modules/query/operator-query.mjs";
import {badRequest, response} from "../../../modules/response.mjs";

const getInboxRouter = express.Router();

getInboxRouter.get('/', verifyToken,(req, res) => {
    const {page} = req.query;
    db.query(getInboxQuery,[req.user.user.unique_id,40,page])
        .then(result=>{
            // if(typeof page === 'undefined' || page == null || page == 1){
                db.query(getInboxCountQuery,[req.user.user.unique_id])
                    .then(result2=>{
                        let page_count = Math.ceil(result2.rows.length/40);
                        if(page_count <= 0){
                            page_count = 1;
                        }
                        res.json(response(false,'success',{
                            page_count:page_count,
                            inbox:result.rows
                        }));
                        res.end();
                    })
                    .catch(err=>{
                        res.json(response(false,'success',{
                            page_count:0,
                            inbox:result.rows
                        }));
                        res.end();
                    });

            // } else {
            //     res.json(response(false,'success',{
            //         page_count:null,
            //         inbox:result.rows
            //     }));
            //     res.end();
            // }

        })
        .catch(err=>{
            console.error(err);
            badRequest(req,res);
        })
});

export {getInboxRouter};