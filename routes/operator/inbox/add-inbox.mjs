import express from 'express';
import {verifyToken} from "../../../modules/auth/token.mjs";
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {addInboxQuery, getUnReadInboxCountQuery} from "../../../modules/query/operator-query.mjs";
import {generateUUID} from "../../../modules/uuid/uuid.mjs";
import {socket_io} from "../../../index.mjs";
import {sendMessage} from "../../../modules/push/push.mjs";

const addInbox = express.Router();

addInbox.post('/',verifyToken,async(req,res)=>{
    if(typeof req.body === 'undefined' || req.body == null){
        badRequest(req,res);
    } else {
        const {
            title,
            message,
            link_to_goal,
            to_unique_id
        } = req.body;
        await db.query(addInboxQuery,[
            title,
            message,
            link_to_goal,
            false,
            false,
            generateUUID(),
            req.user.user.unique_id,
            to_unique_id
        ]).then(async result => {
            if (result.rows.length) {
                await sendMessage(to_unique_id,
                    title,
                    message,
                    {
                        user_unique_id:req.user.user.unique_id
                    });
                await db.query(getUnReadInboxCountQuery, [req.user.user.unique_id])
                    .then(result_count => {
                        socket_io.emit('onInbox', result_count.rows[0]);
                    })
                    .catch(err => {
                        badRequest(req, res);
                    })

                res.json(response(false, 'success', result.rows[0]));
                res.end();
            } else {
                badRequest(req, res);
            }
        }).catch(err => {
            badRequest(req,res);
        })
    }
})

export {addInbox}