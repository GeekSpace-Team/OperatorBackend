import express from 'express';
import {verifyToken} from "../../../modules/auth/token.mjs";
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import {changeOrderDeliveryPrice, getUnReadInboxCountQuery} from "../../../modules/query/operator-query.mjs";
import {sendMessage} from "../../../modules/push/push.mjs";
import {addInboxQuery, getOrderOperatorUniqueId} from "../../../modules/query/delivery-query.mjs";
import {generateUUID} from "../../../modules/uuid/uuid.mjs";
import {socket_io} from "../../../index.mjs";

const changeOrderDeliveryPriceRouter = express.Router();

changeOrderDeliveryPriceRouter.put('/', verifyToken, (req, res) => {
    if (typeof req.body === 'undefined') {
        badRequest(req, res);
    } else {
        const {order_unique_id, delivery_price, reason} = req.body;
        db.query(changeOrderDeliveryPrice, [order_unique_id, req.user.user.unique_id, delivery_price, reason,generateUUID()])
            .then(async result => {
                if (result.rows.length) {
                    let title = `Sargydyň eltip berilmeli bahasy üýtgedi!`;
                    let message = `Täze bahasy: ${delivery_price}, ${reason}`;
                    let to = '';
                    await db.query(getOrderOperatorUniqueId, [order_unique_id])
                        .then(async result_courier => {
                            if (result_courier.rows.length) {
                                to = result_courier.rows[0].operator_unique_id;
                                await sendMessage(result_courier.rows[0].operator_unique_id,
                                    title,
                                    message,
                                    {
                                        order_unique_id: order_unique_id,
                                        operator_unique_id: result_courier.rows[0].operator_unique_id,
                                        user_unique_id: req.user.user.unique_id
                                    });
                            }
                        })
                        .catch(err => {
                        })
                    await db.query(addInboxQuery, [
                        title,
                        message,
                        '/order?unique_id'+order_unique_id,
                        generateUUID(),
                        req.user.user.unique_id,
                        to
                    ])
                        .then(async result => {
                            await db.query(getUnReadInboxCountQuery, [to])
                                .then(result_count => {
                                    socket_io.emit('onInbox', {
                                        unique_id:to,
                                        unread_inbox_count:result_count.rows[0].unread_inbox_count
                                    });
                                })
                                .catch(err => {
                                })
                        })
                        .catch(err => {
                        });
                    res.json(response(false, 'success', result.rows[0]));
                    res.end();
                } else {
                    badRequest(req, res);
                }
            })
            .catch(err => {
                badRequest(req, res);
            })
    }
});

export {changeOrderDeliveryPriceRouter};