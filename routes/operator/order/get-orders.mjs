import express from 'express';
import format from 'pg-format';
import { verifyToken } from '../../../modules/auth/token.mjs';
import { db } from '../../../modules/database/connection.mjs';
import { getCustomers, getCustomersPageCount, getOrders, getOrdersCount, getSellPointId } from '../../../modules/query/operator-query.mjs';
import { badRequest, response } from '../../../modules/response.mjs';

const getOrdersRouter = express.Router();

getOrdersRouter.post('/', verifyToken, async (req, res) => {
    if (typeof req.user === 'undefined' || req.user === null) {
        badRequest(req, res);
    } else {
        const { startDate, endDate, sortBy, perPage, page, search } = req.body;


        db.query(getSellPointId, [req.user.user.unique_id])
            .then(rss => {
                let whereQuery = ` WHERE uss.sell_point_id=${rss.rows[0].sell_point_id} `;
                let orderByQuery = ' ORDER BY c.created_at DESC ';

                if (startDate != null && startDate != '' && typeof startDate !== 'undefined') {
                    let endD = new Date();
                    if (endDate != null && endDate !== '' && typeof endDate !== 'undefined' && endDate != 0) {
                        endD = endDate;
                    } else {
                        endD = `${endD.getFullYear()}-${endD.getMonth() + 1}-${endD.getDate()}`;
                    }
                    whereQuery += ` AND ((c.created_at,c.created_at) OVERLAPS ('${startDate}'::DATE,'${endD}'::DATE)) `;
                }

                if (typeof sortBy !== 'undefined' && sortBy != null) {
                    switch (sortBy) {
                        case 0:
                            orderByQuery = ' ORDER BY c.created_at DESC ';
                            break;
                        case 1:
                            orderByQuery = ' ORDER BY c.created_at ASC ';
                            break;
                        case 2:
                            orderByQuery = ' ORDER BY cus.fullname ';
                            break;
                        case 3:
                            orderByQuery = ' ORDER BY cus.fullname DESC';
                            break;
                    }
                }

                if (typeof search !== 'undefined' && search != null && search != '') {
                    if (whereQuery != '') {
                        whereQuery += " AND ";
                    } else {
                        whereQuery += " WHERE ";
                    }
                    whereQuery += ` (c.additional_information ILIKE '%${search}%' OR cus.fullname ILIKE '%${search}%' OR cus.phone_number ILIKE '%${search}%' OR cus.address_home ILIKE '%${search}%' OR cus.address_work ILIKE '%${search}%' OR cus.information ILIKE '%${search}%' OR c.unique_id='${search}') `;
                }

                let query = format(getOrders, whereQuery, orderByQuery);

                console.log(query);

                db.query(query, [perPage, page])
                    .then(result => {
                        if (page == 1) {
                            let countQuery = format(getOrdersCount, whereQuery, orderByQuery);
                            db.query(countQuery, [])
                                .then(result_count => {
                                    let page_count = Math.ceil(result_count.rows.length / perPage);
                                    if (page_count <= 0) {
                                        page_count = 1;
                                    }
                                    res.json(response(false, 'success', { orders: result.rows, page_count: page_count }));
                                    res.end();
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.json(response(false, 'success', { orders: result.rows, page_count: 0 }));
                                    res.end();
                                })
                        } else {
                            res.json(response(false, 'success', { orders: result.rows, page_count: 0 }));
                            res.end();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        badRequest(req, res);
                    })
            })
            .catch(err => {
                console.log(err);
                badRequest(req, res);
            })

    }
})

export { getOrdersRouter };