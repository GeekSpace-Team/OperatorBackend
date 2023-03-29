import express from "express";
import format from "pg-format";
import { verifyToken } from "../../../modules/auth/token.mjs";
import { tables } from "../../../modules/constant/constant.mjs";
import { db } from "../../../modules/database/connection.mjs";
import { badRequest, response } from "../../../modules/response.mjs";

import {
    insertCancelReason,
    insertCourier,
    insertCustomerInterestedProduct,
    insertCustomerOrder,
    insertCustomerOrderAddress,
    insertCustomerOrderCourier,
    insertCustomerOrderDate,
    insertCustomerOrderDeliveryPrice,
    insertCustomerOrderLocationHistory,
    insertCustomerOrderProduct,
    insertCustomerOrderProductStatus,
    insertCustomerOrderStatus,
    insertCustomers,
    insertCustomerStatus,
    insertFocusWord, insertInbox,
    insertRolePermission,
    insertSellPoint,
    insertSpeakAccent, insertSpeakMode,
    insertSpeakTone, insertUserRole, insertUsers,insertCalls
} from "../../../modules/query/sync-query.mjs";

const insertValues = express.Router();

const getQuery = (type) => {
    if (type === tables.customer) {
        return insertCustomers;
    }
    if (type === tables.cancel_reason) {
        return insertCancelReason;
    }
    if (type === tables.courier) {
        return insertCourier;
    }
    if (type === tables.customer_interested_product) {
        return insertCustomerInterestedProduct;
    }
    if (type === tables.customer_order) {
        return insertCustomerOrder;
    }
    if (type === tables.customer_order_address_history) {
        return insertCustomerOrderAddress;
    }
    if (type === tables.customer_order_courier_history) {
        return insertCustomerOrderCourier;
    }
    if (type === tables.customer_order_date_history) {
        return insertCustomerOrderDate;
    }
    if (type === tables.customer_order_delivery_price) {
        return insertCustomerOrderDeliveryPrice;
    }
    if (type === tables.customer_order_location_history) {
        return insertCustomerOrderLocationHistory;
    }
    if (type === tables.customer_order_product) {
        return insertCustomerOrderProduct;
    }
    if (type === tables.customer_order_product_status_history) {
        return insertCustomerOrderProductStatus;
    }
    if (type === tables.customer_order_status_history) {
        return insertCustomerOrderStatus;
    }
    if (type === tables.customer_status) {
        return insertCustomerStatus;
    }
    if (type === tables.focus_word) {
        return insertFocusWord;
    }
    if (type === tables.role_permission) {
        return insertRolePermission;
    }
    if (type === tables.sell_point) {
        return insertSellPoint;
    }
    if (type === tables.speak_accent) {
        return insertSpeakAccent;
    }
    if (type === tables.speak_tone) {
        return insertSpeakTone;
    }
    if (type === tables.speak_mode) {
        return insertSpeakMode;
    }
    if (type === tables.user_role) {
        return insertUserRole;
    }
    if (type === tables.users) {
        return insertUsers;
    }
    if (type === tables.inbox) {
        return insertInbox;
    }

    if (type === tables.phone_call) {
        return insertCalls;
    }

}

const getValues = async (type, values) => {
    let result = [];
    if (type === tables.customer) {
        await values.forEach((e, i) => {
            const {
                fullname, phone_number, question_mode, address_home, address_work, information, created_at, updated_at, unique_id, operator_unique_id, speak_mode, status, speak_tone, speak_accent, focus_word, find_us
            } = e;
            result.push([fullname, phone_number, question_mode, address_home, address_work, information, created_at, updated_at, unique_id, operator_unique_id, speak_mode, status, speak_tone, speak_accent, focus_word, find_us]);
        })
    }
    if (type === tables.cancel_reason) {
        await values.forEach((e, i) => {
            const {
                unique_id, sell_point_id, reason, created_at, updated_at
            } = e;
            result.push([unique_id, sell_point_id, reason, created_at, updated_at]);
        })
    }
    if (type === tables.courier) {
        await values.forEach((e, i) => {
            const {
                fullname, username, password, phone_number, status, created_at, updated_at, date_of_birthday, work_start_date, sell_point_id, unique_id, user_role, token
            } = e;
            result.push([fullname, username, password, phone_number, status, created_at, updated_at, date_of_birthday, work_start_date, sell_point_id, unique_id, user_role, token]);
        })
    }
    if (type === tables.customer_interested_product) {
        await values.forEach((e, i) => {
            const {
                interested_product_name, interested_product_size, interested_product_color, status, created_at, updated_at, unique_id, customer_unique_id, operator_unique_id
            } = e;
            result.push([interested_product_name, interested_product_size, interested_product_color, status, created_at, updated_at, unique_id, customer_unique_id, operator_unique_id]);
        })
    }
    if (type === tables.customer_order) {
        await values.forEach((e, i) => {
            const {
                unique_id, is_express, created_at, updated_at, additional_information, customer_unique_id, operator_unique_id
            } = e;
            result.push([unique_id, is_express, created_at, updated_at, additional_information, customer_unique_id, operator_unique_id]);
        })
    }
    if (type === tables.customer_order_address_history) {
        await values.forEach((e, i) => {
            const {
                customer_order_unique_id, address, user_unique_id, created_at, updated_at, reason, unique_id
            } = e;
            result.push([customer_order_unique_id, address, user_unique_id, created_at, updated_at, reason, unique_id]);
        })
    }
    if (type === tables.customer_order_courier_history) {
        await values.forEach((e, i) => {
            const {
                customer_order_unique_id, courier_unique_id, operator_unique_id, created_at, updated_at, reason, unique_id
            } = e;
            result.push([customer_order_unique_id, courier_unique_id, operator_unique_id, created_at, updated_at, reason, unique_id]);
        })
    }
    if (type === tables.customer_order_date_history) {
        await values.forEach((e, i) => {
            const {
                customer_order_unique_id, order_date, order_time, user_unique_id, created_at, updated_at, reason, unique_id
            } = e;
            result.push([customer_order_unique_id, order_date, order_time, user_unique_id, created_at, updated_at, reason, unique_id]);
        })
    }
    if (type === tables.customer_order_delivery_price) {
        await values.forEach((e, i) => {
            const {
                customer_order_unique_id, user_unique_id, delivery_price, reason, created_at, updated_at, unique_id
            } = e;
            result.push([customer_order_unique_id, user_unique_id, delivery_price, reason, created_at, updated_at, unique_id]);
        })
    }
    if (type === tables.customer_order_location_history) {
        await values.forEach((e, i) => {
            const {
                customer_order_unique_id, user_unique_id, latitude, longitude, reason, created_at, updated_at, unique_id
            } = e;
            result.push([customer_order_unique_id, user_unique_id, latitude, longitude, reason, created_at, updated_at, unique_id]);
        })
    }
    if (type === tables.customer_order_product) {
        await values.forEach((e, i) => {
            const {
                customer_order_unique_id, product_name, product_brand, product_model, product_artikul_code, product_debt_price, product_cash_price, product_discount, product_size, product_color, product_count, unique_id, created_at, updated_at, reason, operator_unique_id
            } = e;
            result.push([customer_order_unique_id, product_name, product_brand, product_model, product_artikul_code, product_debt_price, product_cash_price, product_discount, product_size, product_color, product_count, unique_id, created_at, updated_at, reason, operator_unique_id]);
        })
    }
    if (type === tables.customer_order_product_status_history) {
        await values.forEach((e, i) => {
            const {
                customer_order_product_unique_id, status, user_unique_id, created_at, updated_at, reason, unique_id
            } = e;
            result.push([customer_order_product_unique_id, status, user_unique_id, created_at, updated_at, reason, unique_id]);
        })
    }
    if (type === tables.customer_order_status_history) {
        await values.forEach((e, i) => {
            const {
                customer_order_unique_id, status, reason, user_unique_id, created_at, updated_at, unique_id
            } = e;
            result.push([customer_order_unique_id, status, reason, user_unique_id, created_at, updated_at, unique_id]);
        })
    }
    if (type === tables.customer_status) {
        await values.forEach((e, i) => {
            const {
                value, status, created_at, updated_at
            } = e;
            result.push([value, status, created_at, updated_at]);
        })
    }
    if (type === tables.focus_word) {
        await values.forEach((e, i) => {
            const {
                value, status, created_at, updated_at
            } = e;
            result.push([value, status, created_at, updated_at]);
        })
    }
    if (type === tables.role_permission) {
        await values.forEach((e, i) => {
            const {
                permission, can_read, can_write, can_edit, can_delete, user_role, created_at, updated_at
            } = e;
            result.push([permission, can_read, can_write, can_edit, can_delete, user_role, created_at, updated_at]);
        })
    }
    if (type === tables.sell_point) {
        await values.forEach((e, i) => {
            const {
                name, address, phone_number, latitude, longitude, created_at, updated_at, unique_id
            } = e;
            result.push([name, address, phone_number, latitude, longitude, created_at, updated_at, unique_id]);
        })
    }
    if (type === tables.speak_accent) {
        await values.forEach((e, i) => {
            const {
                value, status, created_at, updated_at
            } = e;
            result.push([value, status, created_at, updated_at]);
        })
    }
    if (type === tables.speak_tone) {
        await values.forEach((e, i) => {
            const {
                value, status, created_at, updated_at
            } = e;
            result.push([value, status, created_at, updated_at]);
        })
    }
    if (type === tables.speak_mode) {
        await values.forEach((e, i) => {
            const {
                value, created_at, updated_at, status
            } = e;
            result.push([value, created_at, updated_at, status]);
        })
    }
    if (type === tables.user_role) {
        await values.forEach((e, i) => {
            const {
                id,name, created_at, updated_at
            } = e;
            result.push([id,name, created_at, updated_at]);
        })
    }
    if (type === tables.users) {
        await values.forEach((e, i) => {
            const {
                fullname, username, password, phone_number, status, user_role, sell_point_id, token, created_at, updated_at, work_start_date, date_of_birthday, unique_id, user_number
            } = e;
            result.push([fullname, username, password, phone_number, status, user_role, sell_point_id, token, created_at, updated_at, work_start_date, date_of_birthday, unique_id, user_number]);
        })
    }
    if (type === tables.inbox) {
        await values.forEach((e, i) => {
            const {
                message, link_to_goal, is_read, is_delete, created_at, updated_at, unique_id, from_unique_id, to_unique_id
            } = e;
            result.push([message, link_to_goal, is_read, is_delete, created_at, updated_at, unique_id, from_unique_id, to_unique_id]);
        })
    }
    if (type === tables.phone_call) {
        await values.forEach((e, i) => {
            const {
                phone_number, contact_name, call_direction, call_time, call_duration, unique_id, status, created_at, updated_at, user_unique_id, call_state, call_date
            } = e;
            result.push([phone_number, contact_name, call_direction, call_time, call_duration, unique_id, status, created_at, updated_at, user_unique_id, call_state, call_date]);
        })
    }
    return result;
}

insertValues.post('/', verifyToken, async (req, res) => {
    const {
        values,
        type
    } = req.body;
    if (values == null || values.length <= 0 && values === '') {
        res.json(response(false, 'success', 'success'));
        return;
    }
    let v = await getValues(type, values);
    let q = format(getQuery(type), v);
    db.query(q)
        .then(result => {
            res.json(response(false, 'success', result.rows));
            res.end();
        })
        .catch(err => {
            console.log(err);
            badRequest(req, res);
        })
})

export { insertValues };