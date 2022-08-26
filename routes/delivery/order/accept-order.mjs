import express from 'express';
import { badRequest, response } from "../../../modules/response.mjs";
import { orderStatus } from "../../../modules/constant/constant.mjs";
import { db } from "../../../modules/database/connection.mjs";
import format from "pg-format";
import {
    changeOrderProductStatuses,
    changeOrderStatuses,
    getOrderProductsQuery,
    getOrdersOperatorUniqueId,
    addMultipleInboxQuery
} from "../../../modules/query/delivery-query.mjs";
import { verifyToken } from '../../../modules/auth/token.mjs';
import { generateUUID } from '../../../modules/uuid/uuid.mjs';
import { sendMessage } from "../../../modules/push/push.mjs";
import { socket_io } from "../../../index.mjs";
import {getUnReadInboxCountQuery} from "../../../modules/query/operator-query.mjs";

const acceptOrderRouter = express.Router();

const getOrderProducts = async (orders) => {
    let myArray = [];
    let results = [];
    await orders.forEach((item, i) => {
        myArray.push(item.unique_id);
    });

    await db.query(format(getOrderProductsQuery, myArray))
        .then(result => {
            results = result.rows;
        })
        .catch(err => {

        });
    return results;
}

acceptOrderRouter.post('/', verifyToken, (req, res) => {
    if (typeof req.body === 'undefined' || req.body == null) {
        badRequest(req, res);
    } else {
        const {
            orders,
            reason
        } = req.body;
        let orderValues = [];
        if (typeof orders !== 'undefined' && orders != null && orders.length > 0) {
            orders.forEach((item, i) => {
                orderValues.push([item.unique_id, orderStatus.COURIER_ACCEPTED, reason, req.user.user.unique_id, 'now()', 'now()',generateUUID()]);
            });
            db.query(format(changeOrderStatuses, orderValues))
                .then(async result => {
                    if (result.rows.length) {
                        let orderProductValues = [];
                        let orderProducts = await getOrderProducts(orders);
                        orderProducts.forEach((item) => {
                            orderProductValues.push([item.unique_id, orderStatus.COURIER_ACCEPTED, req.user.user.unique_id, 'now()', 'now()', reason,generateUUID()]);
                        });
                        await db.query(format(changeOrderProductStatuses, orderProductValues))
                            .then(async result2 => {
                                if (result2.rows.length) {
                                    let title = `Sargyt tassyklandy!`;
                                    let message = `Sargydyň statusy eltip beriji tarapyndan üýtgedildi!`;
                                    let to = [];
                                    let myArray = [];
                                    await orders.forEach((item, i) => {
                                        myArray.push(item.unique_id);
                                    });
                                    await db.query(format(getOrdersOperatorUniqueId, myArray))
                                        .then(async result_operator => {
                                            if (result_operator.rows.length) {
                                                result_operator.rows.forEach(async (item, i) => {
                                                    to.push([title, message, '/order', false, false, 'now()', 'now()',
                                                        generateUUID(),
                                                        req.user.user.unique_id,
                                                        item.operator_unique_id]);
                                                    await sendMessage(item.operator_unique_id,
                                                        title,
                                                        message,
                                                        {
                                                            order_unique_id: item.unique_id,
                                                            operator_unique_id: item.operator_unique_id,
                                                            user_unique_id: req.user.user.unique_id
                                                        });
                                                });
                                            }
                                        })
                                        .catch(err => { });
                                    await db.query(format(addMultipleInboxQuery, to))
                                        .then(async result_inbox => {
                                            if (result_inbox.rows.length) {
                                                result_inbox.rows.forEach(async(item, index) => {
                                                    await db.query(getUnReadInboxCountQuery, [item.to_unique_id])
                                                    .then(result_count => {
                                                        socket_io.emit('onInbox', {
                                                            unique_id:item.to_unique_id,
                                                            unread_inbox_count:result_count.rows[0].unread_inbox_count
                                                        });
                                                    })
                                                    .catch(err => {
                                                        
                                                    })
                                                })
                                            }
                                        })
                                        .catch(err => { 
                                            console.log(format(addMultipleInboxQuery, to));
                                        });
                                    res.json(response(false, 'success', 'success'));
                                    res.end();
                                } else {
                                    badRequest(req, res);
                                }
                            })
                            .catch(err => {
                                badRequest(req, res);
                            });
                    } else {
                        badRequest(req, res);
                    }
                })
                .catch(err => {
                    console.log(err);
                    badRequest(req, res);
                })
        }
    }
});

export { acceptOrderRouter };