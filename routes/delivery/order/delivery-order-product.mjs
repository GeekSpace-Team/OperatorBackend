import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/database/connection.mjs";
import format from "pg-format";
import {
    addInboxQuery,
    changeOrderProductStatuses,
    changeOrderStatuses,
    getOrderOperatorUniqueId
} from "../../../modules/query/delivery-query.mjs";
import {verifyToken} from '../../../modules/auth/token.mjs';
import {generateUUID} from '../../../modules/uuid/uuid.mjs';
import {sendMessage} from "../../../modules/push/push.mjs";
import {socket_io} from "../../../index.mjs";
import {getUnReadInboxCountQuery} from "../../../modules/query/operator-query.mjs";
import {orderStatus} from "../../../modules/constant/constant.mjs";

const deliveryOrderProductRouter = express.Router();

deliveryOrderProductRouter.post('/', verifyToken, async (req, res) => {
    if (typeof req.body === 'undefined' || req.body == null) {
        badRequest(req, res);
    } else {
        const {
            order_products,
            reason,
            order_unique_id
        } = req.body;
        let values = [];
        let isDelivered = false;
        await order_products.forEach((item, i) => {
            if (item.order_product_status == orderStatus.COURIER_DELIVERED) {
                isDelivered = true;
            }
            values.push([item.unique_id, item.order_product_status, req.user.user.unique_id, 'now()', 'now()', reason,generateUUID()]);
        });
        await db.query(format(changeOrderProductStatuses, values))
            .then(async result => {
                if (result.rows.length) {
                    let statusOrder=orderStatus.REJECTED;
                    if (isDelivered) {
                        statusOrder=orderStatus.COURIER_DELIVERED;
                    }

                    let orderValues = [];
                    orderValues.push([order_unique_id, statusOrder, reason, req.user.user.unique_id, 'now()', 'now()',generateUUID()]);
                    await db.query(format(changeOrderStatuses, orderValues))
                        .then(result_order => {
                        })
                        .catch(err => {
                            console.log(err+" Order//");
                        });
                    let title = `Sargyt harytlarynyň statusy üýtgedildi!`;
                    let message = `Sargyt harytlarynyň statusy eltip beriji tarapyndan üýtgedildi!`;
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
                            console.error(err);
                        });

                    await db.query(addInboxQuery, [
                        title,
                        message,
                        '/order?unique_id='+order_unique_id,
                        generateUUID(),
                        req.user.user.unique_id,
                        to
                    ])
                        .then(async result => {
                            await db.query(getUnReadInboxCountQuery, [to])
                                .then(result_count => {
                                    socket_io.emit('onInbox', {
                                        unique_id: to,
                                        unread_inbox_count: result_count.rows[0].unread_inbox_count
                                    });
                                })
                                .catch(err => {
                                })
                        })
                        .catch(err => {
                        });
                    res.json(response(false, 'success', 'success'));
                    res.end();
                }
            })
            .catch(err => {

                badRequest(req, res);
            })
    }
})

export {deliveryOrderProductRouter};