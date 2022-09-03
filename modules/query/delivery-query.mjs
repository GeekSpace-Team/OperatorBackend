import { orderStatus } from "../constant/constant.mjs";

export const loginQuery = `
SELECT u.*,r.name as role_name,
(SELECT array_to_json(array_agg(p.*)) FROM role_permission p WHERE p.user_role=u.user_role) as user_permissions
FROM courier u 
LEFT JOIN user_role r ON r.id=u.user_role
LEFT JOIN sell_point s ON s.id=u.sell_point_id
WHERE u.username=$1 AND u.password=$2 AND r.name='operator';
`;

export const updateToken = "UPDATE courier SET token=$1 WHERE unique_id=$2 RETURNING *";

export const getOrderByStatusQuery = `
SELECT o.id, 
    o.unique_id, o.is_express, o.created_at, 
    o.updated_at, o.additional_information, 
    o.customer_unique_id, o.operator_unique_id,
    c.fullname,c.phone_number,
    (SELECT array_to_json(array_agg(ca.*)) FROM customer_order_address_history ca WHERE ca.customer_order_unique_id=o.unique_id) as order_address_history,
    (SELECT array_to_json(array_agg(cd.*)) FROM customer_order_date_history cd WHERE cd.customer_order_unique_id=o.unique_id) as order_date_history,
    (SELECT array_to_json(array_agg(cp.*)) FROM customer_order_delivery_price cp WHERE cp.customer_order_unique_id=o.unique_id) as order_price_history,
    (SELECT array_to_json(array_agg(cl.*)) FROM customer_order_location_history cl WHERE cl.customer_order_unique_id=o.unique_id) as order_location_history,
    (SELECT CASE WHEN s.status IS NULL THEN '${orderStatus.PENDING}'
                 ELSE s.status
            END
        FROM customer_order_status_history s WHERE s.customer_order_unique_id=o.unique_id ORDER BY s.created_at DESC LIMIT 1) as current_status
    FROM customer_order o
    LEFT JOIN customer c ON c.unique_id=o.customer_unique_id
    WHERE (SELECT ch.status FROM customer_order_status_history ch 
        WHERE ch.customer_order_unique_id=o.unique_id ORDER BY ch.updated_at DESC LIMIT 1) = $1
        AND 
        (SELECT co.courier_unique_id FROM customer_order_courier_history co 
        WHERE co.customer_order_unique_id=o.unique_id ORDER BY co.updated_at DESC LIMIT 1) = $2
    ORDER BY o.is_express DESC,o.created_at ASC;
`;

export const getOrderByUniqueQuery = `
SELECT o.id, 
    o.unique_id, o.is_express, o.created_at, 
    o.updated_at, o.additional_information, 
    o.customer_unique_id, o.operator_unique_id,
    c.fullname,c.phone_number,
    (SELECT array_to_json(array_agg(ca.*)) FROM customer_order_address_history ca WHERE ca.customer_order_unique_id=o.unique_id) as order_address_history,
    (SELECT array_to_json(array_agg(cd.*)) FROM customer_order_date_history cd WHERE cd.customer_order_unique_id=o.unique_id) as order_date_history,
    (SELECT array_to_json(array_agg(cp.*)) FROM customer_order_delivery_price cp WHERE cp.customer_order_unique_id=o.unique_id) as order_price_history,
    (SELECT array_to_json(array_agg(cl.*)) FROM customer_order_location_history cl WHERE cl.customer_order_unique_id=o.unique_id) as order_location_history,
    (SELECT CASE WHEN s.status IS NULL THEN '${orderStatus.PENDING}'
                 ELSE s.status
            END
        FROM customer_order_status_history s WHERE s.customer_order_unique_id=o.unique_id ORDER BY s.created_at DESC LIMIT 1) as current_status
    FROM customer_order o
    LEFT JOIN customer c ON c.unique_id=o.customer_unique_id
    WHERE o.unique_id = $1
        AND 
        (SELECT co.courier_unique_id FROM customer_order_courier_history co 
        WHERE co.customer_order_unique_id=o.unique_id ORDER BY co.updated_at DESC LIMIT 1) = $2
    ORDER BY o.is_express DESC,o.created_at ASC;
`;

export const getOrderProductHistoryByOrderId = `
SELECT cp.id, 
    cp.customer_order_unique_id, 
    cp.product_name, 
    cp.product_brand, cp.product_model, cp.product_artikul_code, 
    cp.product_debt_price, cp.product_cash_price, 
    cp.product_discount, cp.product_size, 
    cp.product_color, cp.product_count, cp.unique_id, cp.created_at, 
    cp.updated_at, cp.reason, cp.operator_unique_id,
    (SELECT ps.status FROM customer_order_product_status_history ps WHERE ps.customer_order_product_unique_id=cp.unique_id ORDER BY ps.created_at DESC LIMIT 1) as order_product_status
    FROM customer_order_product cp
    WHERE cp.customer_order_unique_id=$1;
`;

export const getOrderOperatorUniqueId=`
    SELECT operator_unique_id
    FROM customer_order WHERE unique_id=$1;
`;

export const addInboxQuery=`
    INSERT INTO inbox(
        title, message, link_to_goal, is_read, is_delete, created_at, updated_at, unique_id, from_unique_id, to_unique_id)
    VALUES ($1, $2, $3, false, false, now(), now(), $4,$5, $6);
`;

export const changeOrderStatuses=`
INSERT INTO customer_order_status_history(
    customer_order_unique_id, status, reason, user_unique_id, created_at, updated_at,unique_id)
    VALUES %L RETURNING *;
`;

export const changeOrderProductStatuses=`
INSERT INTO customer_order_product_status_history(
    customer_order_product_unique_id, status, user_unique_id, created_at, updated_at, reason,unique_id)
    VALUES %L RETURNING *;
`;

export const getOrderProductsQuery=`
    SELECT unique_id
    FROM customer_order_product WHERE customer_order_unique_id IN (%L);
`;

export const getOrdersOperatorUniqueId=`
    SELECT operator_unique_id,unique_id
    FROM customer_order WHERE unique_id IN (%L);
`;

export const addMultipleInboxQuery=`
    INSERT INTO inbox(
        title, message, link_to_goal, is_read, is_delete, created_at, updated_at, unique_id, from_unique_id, to_unique_id)
    VALUES %L RETURNING *;
`;


export const getCancelReasonQuery = `
SELECT id, unique_id, sell_point_id, reason, created_at, updated_at
	FROM cancel_reason WHERE sell_point_id = $1;
`;



