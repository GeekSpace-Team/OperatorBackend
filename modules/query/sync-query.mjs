// Customers
export const getAllCustomers=`
    SELECT * FROM customer;
`;

export const getAllCustomerInterestedProducts=`
    SELECT * FROM customer_interested_product;
`;

export const getAllUserRole=`
    SELECT * FROM user_role;
`;

export const getAllSpeakTone=`
    SELECT * FROM speak_tone;
`;

export const getAllSpeakMode=`
    SELECT * FROM speak_accent;
`;

export const getAllSellPoint=`
    SELECT * FROM sell_point;
`;

export const getAllRolePermissions=`
    SELECT * FROM role_permission;
`;

export const getAllInbox=`
    SELECT * FROM inbox WHERE is_delete=false AND (from_unique_id = '%s' OR to_unique_id = '%s');
`;

export const getAllFocusWord=`
    SELECT * FROM focus_word;
`;

export const getAllCustomerStatus=`
    SELECT * FROM customer_status;
`;

export const getAllCancelReason=`
    SELECT * FROM cancel_reason WHERE sell_point_id='%s';
`;

export const getAllCourier=`
    SELECT * FROM courier WHERE sell_point_id='%s' OR sell_point_id IS NULL;
`;

export const getAllUsers=`
    SELECT * FROM users WHERE sell_point_id='%s';
`;


// ORDERS
export const getAllCustomerOrders=`
    SELECT co.*,us.sell_point_id FROM public.customer_order co
    LEFT JOIN users us ON us.unique_id=co.operator_unique_id
    WHERE us.sell_point_id=%s;
`;

export const getAllCustomerOrderAddress=`
    SELECT cao.*,co.operator_unique_id,us.sell_point_id FROM customer_order_address_history cao 
    LEFT JOIN customer_order co ON co.unique_id=cao.customer_order_unique_id
    LEFT JOIN users us ON us.unique_id = co.operator_unique_id
    WHERE us.sell_point_id=%s;
`;

export const getAllOrderCourier=`
    SELECT cao.*,co.operator_unique_id,us.sell_point_id FROM customer_order_courier_history cao 
    LEFT JOIN customer_order co ON co.unique_id=cao.customer_order_unique_id
    LEFT JOIN users us ON us.unique_id = co.operator_unique_id
    WHERE us.sell_point_id=%s;
`;

export const getAllOrderDate=`
    SELECT cao.*,co.operator_unique_id,us.sell_point_id FROM customer_order_date_history cao 
    LEFT JOIN customer_order co ON co.unique_id=cao.customer_order_unique_id
    LEFT JOIN users us ON us.unique_id = co.operator_unique_id
    WHERE us.sell_point_id=%s;
`;

export const getAllOrderDelivery=`
    SELECT cao.*,co.operator_unique_id,us.sell_point_id FROM customer_order_delivery_price cao 
    LEFT JOIN customer_order co ON co.unique_id=cao.customer_order_unique_id
    LEFT JOIN users us ON us.unique_id = co.operator_unique_id
    WHERE us.sell_point_id=%s;
`;

export const getAllOrderLocation=`
    SELECT cao.*,co.operator_unique_id,us.sell_point_id FROM customer_order_location_history cao 
    LEFT JOIN customer_order co ON co.unique_id=cao.customer_order_unique_id
    LEFT JOIN users us ON us.unique_id = co.operator_unique_id
    WHERE us.sell_point_id=%s;
`;

export const getAllOrderProduct=`
    SELECT cao.*,co.operator_unique_id,us.sell_point_id FROM customer_order_product cao 
    LEFT JOIN customer_order co ON co.unique_id=cao.customer_order_unique_id
    LEFT JOIN users us ON us.unique_id = co.operator_unique_id
    WHERE us.sell_point_id=%s;
`;

export const getAllOrderProductStatus=`
    SELECT cao.*,co.operator_unique_id,us.sell_point_id FROM customer_order_product_status_history cao 
    LEFT JOIN customer_order_product cop ON cop.unique_id=cao.customer_order_product_unique_id
    LEFT JOIN customer_order co ON co.unique_id=cop.customer_order_unique_id
    LEFT JOIN users us ON us.unique_id = co.operator_unique_id
    WHERE us.sell_point_id=%s;
`;

export const getAllOrderStatus=`
    SELECT cao.*,co.operator_unique_id,us.sell_point_id FROM customer_order_status_history cao 
    LEFT JOIN customer_order co ON co.unique_id=cao.customer_order_unique_id
    LEFT JOIN users us ON us.unique_id = co.operator_unique_id
    WHERE us.sell_point_id=%s;
`;


// CHECKER
export const checkIds=`
    SELECT unique_id FROM %s WHERE unique_id IN (%L);
`;


// INSERT VALUES

export const insertCustomers=`
    INSERT INTO public.customer(
        fullname, phone_number, question_mode, address_home, address_work, information, created_at, updated_at, unique_id, operator_unique_id, speak_mode, status, speak_tone, speak_accent, focus_word, find_us)
        VALUES %L RETURNING *;
`;

export const insertCustomerInterestedProduct=`
    INSERT INTO public.customer_interested_product(
        interested_product_name, interested_product_size, interested_product_color, status, created_at, updated_at, unique_id, customer_unique_id, operator_unique_id)
        VALUES %L RETURNING *;
`;

export const insertUserRole=`
INSERT INTO public.user_role(
    name, created_at, updated_at)
    VALUES %L RETURNING *;
`;

export const insertSpeakTone=`
INSERT INTO public.speak_tone(
    value, status, created_at, updated_at)
    VALUES %L RETURNING *;
`;
export const insertSpeakMode=`
INSERT INTO public.speak_mode(
    value, created_at, updated_at, status)
    VALUES %L RETURNING *;
`;

export const insertSpeakAccent=`
    INSERT INTO public.speak_accent(
        value, status, created_at, updated_at)
        VALUES %L RETURNING *;
`;

export const insertSellPoint=`
    INSERT INTO public.sell_point(
        name, address, phone_number, latitude, longitude, created_at, updated_at, unique_id)
        VALUES %L RETURNING *;
`;

export const insertRolePermission=`
    INSERT INTO public.role_permission(
        permission, can_read, can_write, can_edit, can_delete, user_role, created_at, updated_at)
        VALUES %L RETURNING *;
`;

export const insertFocusWord=`
    INSERT INTO public.focus_word(
        value, status, created_at, updated_at)
        VALUES %L RETURNING *;
`;

export const insertCustomerStatus=`
    INSERT INTO public.customer_status(
        value, status, created_at, updated_at)
        VALUES %L RETURNING *;
`;

export const insertCancelReason=`
    INSERT INTO public.cancel_reason(
        unique_id, sell_point_id, reason, created_at, updated_at)
        VALUES %L RETURNING *;
`;

export const insertCourier=`
    INSERT INTO public.courier(
        fullname, username, password, phone_number, status, created_at, updated_at, date_of_birthday, work_start_date, sell_point_id, unique_id, user_role, token)
        VALUES %L RETURNING *;
`;

export const insertUsers=`
    INSERT INTO public.users(
        fullname, username, password, phone_number, status, user_role, sell_point_id, token, created_at, updated_at, work_start_date, date_of_birthday, unique_id, user_number)
        VALUES %L RETURNING *;
`;

export const insertCustomerOrder=`
    INSERT INTO public.customer_order(
        unique_id, is_express, created_at, updated_at, additional_information, customer_unique_id, operator_unique_id)
        VALUES %L RETURNING *;
`;

export const insertCustomerOrderAddress=`
    INSERT INTO public.customer_order_address_history(
        customer_order_unique_id, address, user_unique_id, created_at, updated_at, reason,unique_id)
        VALUES %L RETURNING *;
`;
export const insertCustomerOrderCourier=`
    INSERT INTO public.customer_order_courier_history(
        customer_order_unique_id, courier_unique_id, operator_unique_id, created_at, updated_at, reason,unique_id)
        VALUES %L RETURNING *;
`;
export const insertCustomerOrderDate=`
    INSERT INTO public.customer_order_date_history(
        customer_order_unique_id, order_date, order_time, user_unique_id, created_at, updated_at, reason,unique_id)
        VALUES %L RETURNING *;
`;
export const insertCustomerOrderDeliveryPrice=`
    INSERT INTO public.customer_order_delivery_price(
        customer_order_unique_id, user_unique_id, delivery_price, reason, created_at, updated_at,unique_id)
        VALUES %L RETURNING *;
`;
export const insertCustomerOrderLocationHistory=`
    INSERT INTO public.customer_order_location_history(
        customer_order_unique_id, user_unique_id, latitude, longitude, reason, created_at, updated_at,unique_id)
        VALUES %L RETURNING *;
`;
export const insertCustomerOrderProduct=`
    INSERT INTO public.customer_order_product(
        customer_order_unique_id, product_name, product_brand, product_model, product_artikul_code, product_debt_price, product_cash_price, product_discount, product_size, product_color, product_count, unique_id, created_at, updated_at, reason, operator_unique_id)
        VALUES %L RETURNING *;
`;
export const insertCustomerOrderProductStatus=`
    INSERT INTO public.customer_order_product_status_history(
        customer_order_product_unique_id, status, user_unique_id, created_at, updated_at, reason,unique_id)
        VALUES %L RETURNING *;
`;
export const insertCustomerOrderStatus=`
    INSERT INTO public.customer_order_status_history(
        customer_order_unique_id, status, reason, user_unique_id, created_at, updated_at,unique_id)
        VALUES %L RETURNING *;
`;

export const insertInbox=`
    INSERT INTO public.inbox(
        message, link_to_goal, is_read, is_delete, created_at, updated_at, unique_id, from_unique_id, to_unique_id)
        VALUES %L RETURNING *;
`;


export const truncateTableQuery=`
    TRUNCATE TABLE %s RESTART IDENTITY;
`;