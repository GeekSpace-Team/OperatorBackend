import express from 'express';
import format from 'pg-format';
import { verifyToken } from '../../../modules/auth/token.mjs';
import { orderStatus } from '../../../modules/constant/constant.mjs';
import { db } from '../../../modules/database/connection.mjs';
import { addOrder, addOrderAddress, addOrderCourier, addOrderDate, addOrderDeliveryPrice, addOrderLocationHistory, addOrderProduct, addOrderProductStatus, addOrderStatus } from '../../../modules/query/operator-query.mjs';
import { badRequest, response } from '../../../modules/response.mjs';
import { generateUUID } from '../../../modules/uuid/uuid.mjs';
import {sendMessage} from "../../../modules/push/push.mjs";

const addOrderRouter = express.Router();

addOrderRouter.post('/', verifyToken, async (req, res) => {
    if (typeof req.body === 'undefined' || req.body == null || typeof req.user === 'undefined' || req.user == null) {
        badRequest(req, res);
    } else {
        const {
            // order
            is_express,
            additional_information,
            customer_unique_id,
            // order product
            products,
            // address
            address,
            // courier
            courier_unique_id,
            // date and time
            order_date,
            order_time,
            // delivery price
            delivery_price,
            // location
            latitude,
            longitude,
            // order status
            status
        } = req.body;
        let insertedOrderUniqueId = generateUUID();
        let operatorUniqueId = req.user.user.unique_id;
        await db.query(addOrder, [
            insertedOrderUniqueId,
            is_express,
            additional_information,
            customer_unique_id,
            operatorUniqueId
        ]).then(result => {
            if (result.rows) {
            } else {
                badRequest(req, res);
                return;
            }
        }).catch(err => {
            badRequest(req, res);
            return;
        });
        let insertedProducts = [];
        let values = [];
        if (typeof products !== 'undefined' && products != null) {
            products.forEach(product => {
                values.push([
                    insertedOrderUniqueId,
                    product.product_name,
                    product.product_brand,
                    product.product_model,
                    product.product_artikul_code,
                    product.product_debt_price,
                    product.product_cash_price,
                    product.product_discount,
                    product.product_size,
                    product.product_color,
                    product.product_count,
                    generateUUID(),
                    'now()',
                    'now()',
                    '',
                    operatorUniqueId
                ]
                );
            });
            await db.query(format(addOrderProduct, values))
                .then(result => {
                    if (result.rows.length) {
                        insertedProducts = result.rows;
                    } else { }
                })
                .catch(err => {
                    console.log(`1: ${err}`);
                });
        }


        if (typeof address !== 'undefined' && address != null && address !== '') {
            await db.query(addOrderAddress, [insertedOrderUniqueId, address, operatorUniqueId, '',generateUUID()])
                .then(result => {
                })
                .catch(err => {
                    console.log(`2: ${err}`);
                });
        }

        if (typeof order_date !== 'undefined' && order_date != null && order_date !== ''
            && typeof order_time !== 'undefined' && order_time != null && order_time !== '') {
            await db.query(addOrderDate, [
                insertedOrderUniqueId,
                order_date,
                order_time,
                operatorUniqueId,
                '',
                generateUUID()
            ])
                .then(result => { })
                .catch(err => {
                    console.log(`3: ${err}`);
                });
        }

        if (typeof delivery_price !== 'undefined' && delivery_price != null && delivery_price !== '') {
            await db.query(addOrderDeliveryPrice, [
                insertedOrderUniqueId,
                operatorUniqueId,
                delivery_price,
                '',
                generateUUID()
            ])
                .then(result => { })
                .catch(err => {
                    console.log(`4: ${err}`);
                });
        }


        if (typeof courier_unique_id !== 'undefined' && courier_unique_id != null && courier_unique_id !== '') {
            db.query(addOrderCourier, [
                insertedOrderUniqueId,
                courier_unique_id,
                operatorUniqueId,
                '',
                generateUUID()
            ])
                .then(async result => { 
                    await sendMessage(courier_unique_id,
                        `ÜNS BERIŇ SIZE TÄZE SARGYT BERKIDILDI!`,
                        `SARGYDY GÖRMEK ÜÇIN ÜSTÜNE BASYŇ`,
                        {
                        order_unique_id:insertedOrderUniqueId,
                        courier_unique_id:courier_unique_id,
                        user_unique_id:req.user.user.unique_id
                    });
                })
                .catch(err => {
                    console.log(`5: ${err}`);
                });
        }


        if (typeof latitude !== 'undefined' && latitude != null && latitude !== ''
            && typeof longitude !== 'undefined' && longitude != null && longitude !== '') {
            await db.query(addOrderLocationHistory, [
                insertedOrderUniqueId,
                operatorUniqueId,
                latitude,
                longitude,
                '',
                generateUUID()
            ])
                .then(result => { })
                .catch(err => {
                    console.log(`6: ${err}`);
                });
        }

        if (typeof status !== 'undefined' && status != null && status !== '') {
            await db.query(addOrderStatus, [
                insertedOrderUniqueId,
                status,
                '',
                operatorUniqueId,
                generateUUID()
            ])
                .then(result => { })
                .catch(err => {
                    console.log(`7: ${err}`);
                });
        }

        if (typeof insertedProducts !== 'undefined' && insertedProducts != null) {
            let productValues = [];
            insertedProducts.forEach(product => {
                productValues.push([
                    insertedOrderUniqueId,
                    orderStatus.NONE,
                    operatorUniqueId,
                    'now()',
                    'now()',
                    '',
                    generateUUID()
                ]
                );
            });
            let query = format(addOrderProductStatus, productValues);

            await db.query(query)
                .then(result => {
                    res.json(response(false, 'success', 'success'));
                    res.end();
                })
                .catch(err => {
                    console.log(`8: ${err}`);
                    badRequest(req, res);
                });
        } else {
            res.json(response(false, 'success', 'success'));
            res.end();
        }

    }
});


export { addOrderRouter };