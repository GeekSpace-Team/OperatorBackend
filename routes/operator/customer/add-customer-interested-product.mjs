import express from 'express';
import format from 'pg-format';
import { verifyToken } from '../../../modules/auth/token.mjs';
import { db } from '../../../modules/database/connection.mjs';
import { addCustomerInterestedProducts } from '../../../modules/query/operator-query.mjs';
import { badRequest, response } from '../../../modules/response.mjs';
import { generateUUID } from '../../../modules/uuid/uuid.mjs';

const addCustomerInterestedProductRoute = express.Router();

addCustomerInterestedProductRoute.post('/', verifyToken, async (req, res) => {
    if (typeof req.body === 'undefined' || req.body == null || typeof req.user === 'undefined' || req.user == null 
    || typeof req.body.interested_products === 'undefined' || req.body.interested_products.size<=0) {
        badRequest(req, res);
    } else {
        const {interested_products,customerUniqueId}=req.body;
        if (
            typeof interested_products === "undefined" ||
            interested_products == null
        ) {
            interested_products = [];
        }
        let values = [];
        if (interested_products.length > 0) {
            interested_products.forEach((item, i) => {
                // interested_product_name, interested_product_size, interested_product_color, status, created_at, updated_at, unique_id, customer_unique_id
                values.push([
                    item.interested_product_name,
                    item.interested_product_size,
                    item.interested_product_color,
                    1,
                    "now()",
                    "now()",
                    generateUUID(),
                    customerUniqueId,
                    req.user.user.unique_id
                ]);
            });
        }

        let addInterestingProduct = format(addCustomerInterestedProducts, values);
        await db
            .query(addInterestingProduct)
            .then((result) => {
                if (result.rows.length) {
                    res.json(response(false, 'success', {
                        interested_products: result.rows
                    }));
                    res.end();
                } else {
                    badRequest(req, res);
                }
            })
            .catch((err) => {
                console.log(err+"");
                badRequest(req, res);
            });
    }
});


export { addCustomerInterestedProductRoute };