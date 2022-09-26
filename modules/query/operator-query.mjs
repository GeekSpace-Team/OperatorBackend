import { callStatus } from "../constant/constant.mjs";

export const selectCustomerByPhoneNumber = `
SELECT c.*,s1.value AS speak_mode_text,
s2.value AS customer_status_text,
s3.value AS speak_tone_text,
s4.value AS speak_accent_text,
s5.value AS focus_word_text,
(SELECT array_to_json(array_agg(p.*)) FROM customer_interested_product p WHERE p.customer_unique_id=c.unique_id) AS interested_products
FROM customer c
LEFT JOIN speak_mode s1 ON s1.id=c.speak_mode
LEFT JOIN customer_status s2 ON s2.id=c.status
LEFT JOIN speak_tone s3 ON s3.id=c.speak_tone
LEFT JOIN speak_accent s4 ON s4.id=c.speak_accent
LEFT JOIN focus_word s5 ON s5.id=c.focus_word
WHERE c.phone_number=$1;
`;

export const selectPhoneCallByUniqueId = `
SELECT * FROM phone_call WHERE unique_id=$1 AND phone_number=$2;
`;

export const loginQuery = `
SELECT u.*,r.name as role_name,
(SELECT array_to_json(array_agg(p.*)) FROM role_permission p WHERE p.user_role=u.user_role) as user_permissions
FROM users u 
LEFT JOIN user_role r ON r.id=u.user_role
LEFT JOIN sell_point s ON s.id=u.sell_point_id
WHERE u.username=$1 AND u.password=$2 AND r.name!='courier';
`;

export const updateToken = "UPDATE users SET token=$1 WHERE unique_id=$2 RETURNING *";

export const insertLoginHistory = `
INSERT INTO login_history(
	created_at, updated_at, unique_id, user_unique_id,type,device_name)
	VALUES (now(), now(), $1, $2,$3,$4) RETURNING *;
`;

export const fcmTokenInsert = `
INSERT INTO fcm_token(
	token, user_role, created_at, updated_at, user_unique_id)
	VALUES ($1,$2,now(),now(),$3);
`;

export const insertPhoneCall = `
INSERT INTO phone_call(
	phone_number, contact_name, call_direction, call_date, call_time, call_duration, unique_id, status, created_at, updated_at, user_unique_id,call_state)
	VALUES ($1,$2,$3,$4,$5,$6,$7,$8,now(),now(),$9,$10) RETURNING *;
`;

export const updatePhoneCall = `
UPDATE phone_call
	SET phone_number=$1, 
	contact_name=$2, 
	call_direction=$3, 
	call_date=$4, 
	call_time=$5, 
	call_duration=$6, 
	status=$7,  
	updated_at=now(), 
	user_unique_id=$8,
	call_state=$9
	WHERE unique_id=$10 RETURNING *;
`;

export const updateByLastCallState = `
	UPDATE phone_call SET call_state=$1 WHERE phone_number = $2 AND call_state=3 RETURNING *;
`;


export const getMissedCall = `
SELECT p.*, COALESCE(c.fullname, '--------') as user_full_name,c.address_home,c.address_work,cs.value AS user_status,c.unique_id as customer_unique_id,
(SELECT COUNT(p3.*) FROM phone_call p3 WHERE p3.phone_number=p.phone_number  AND p3.user_unique_id=$1) AS all_call_history_count,
(SELECT array_to_json(array_agg(p2.*)) FROM phone_call p2 WHERE p.phone_number=p2.phone_number  AND p2.user_unique_id=$1) AS call_history
FROM phone_call p 
LEFT JOIN customer c ON c.phone_number=p.phone_number
LEFT JOIN customer_status cs ON cs.id=c.status
WHERE (p.call_state='${callStatus.REJECTED}' OR p.call_state='${callStatus.ACCEPTED_AFTER_REJECTED}') AND p.user_unique_id=$1
%s
%s 
LIMIT $2 OFFSET ($3 - 1) * $2;
`;

export const getMissedCallCount = `
SELECT p.*, COALESCE(c.fullname, '--------') as user_full_name,
(SELECT COUNT(p3.*) FROM phone_call p3 WHERE p3.phone_number=p.phone_number  AND p3.user_unique_id=$1) AS all_call_history_count,
(SELECT array_to_json(array_agg(p2.*)) FROM phone_call p2 WHERE p.phone_number=p2.phone_number  AND p2.user_unique_id=$1) AS call_history
FROM phone_call p 
LEFT JOIN customer c ON c.phone_number=p.phone_number
WHERE (p.call_state='${callStatus.REJECTED}' OR p.call_state='${callStatus.ACCEPTED_AFTER_REJECTED}') AND p.user_unique_id=$1
%s
%s ;
`;

export const getAcceptedCall = `
SELECT p.*, COALESCE(c.fullname, '--------') as user_full_name,c.address_home,c.address_work,cs.value AS user_status,c.unique_id as customer_unique_id,
(SELECT COUNT(p3.*) FROM phone_call p3 WHERE p3.phone_number=p.phone_number AND p3.user_unique_id=$1) AS all_call_history_count,
(SELECT array_to_json(array_agg(p2.*)) FROM phone_call p2 WHERE p.phone_number=p2.phone_number AND p2.user_unique_id=$1) AS call_history
FROM phone_call p 
LEFT JOIN customer c ON c.phone_number=p.phone_number
LEFT JOIN customer_status cs ON cs.id=c.status
WHERE (p.call_state='${callStatus.ACCEPTED}') AND p.user_unique_id=$1
%s
%s 
LIMIT $2 OFFSET ($3 - 1) * $2;
`;

export const getAcceptedCallCount = `
SELECT p.*, COALESCE(c.fullname, '--------') as user_full_name,
(SELECT COUNT(p3.*) FROM phone_call p3 WHERE p3.phone_number=p.phone_number  AND p3.user_unique_id=$1) AS all_call_history_count,
(SELECT array_to_json(array_agg(p2.*)) FROM phone_call p2 WHERE p.phone_number=p2.phone_number  AND p2.user_unique_id=$1) AS call_history
FROM phone_call p 
LEFT JOIN customer c ON c.phone_number=p.phone_number
WHERE (p.call_state='${callStatus.ACCEPTED}') AND p.user_unique_id=$1
%s
%s ;
`;


export const getAcceptedCallAdmin = `
SELECT p.*, COALESCE(c.fullname, '--------') as user_full_name,c.address_home,c.address_work,cs.value AS user_status,c.unique_id as customer_unique_id,
u.fullname AS operator_fullname,sl.name AS sell_point_name,
(SELECT COUNT(p3.*) FROM phone_call p3 WHERE p3.phone_number=p.phone_number) AS all_call_history_count,
(SELECT array_to_json(array_agg(p2.*)) FROM phone_call p2 WHERE p.phone_number=p2.phone_number) AS call_history
FROM phone_call p 
LEFT JOIN customer c ON c.phone_number=p.phone_number
LEFT JOIN customer_status cs ON cs.id=c.status
LEFT JOIN users u ON u.unique_id=p.user_unique_id
LEFT JOIN sell_point sl ON sl.id=u.sell_point_id
WHERE (p.call_state='${callStatus.ACCEPTED}')
%s
%s 
LIMIT $2 OFFSET ($3 - 1) * $2;
`;

export const getAcceptedCallAdminCount = `
SELECT p.*, COALESCE(c.fullname, '--------') as user_full_name,c.address_home,c.address_work,cs.value AS user_status,c.unique_id as customer_unique_id,
u.fullname AS operator_fullname,sl.name AS sell_point_name,
(SELECT COUNT(p3.*) FROM phone_call p3 WHERE p3.phone_number=p.phone_number) AS all_call_history_count,
(SELECT array_to_json(array_agg(p2.*)) FROM phone_call p2 WHERE p.phone_number=p2.phone_number) AS call_history
FROM phone_call p 
LEFT JOIN customer c ON c.phone_number=p.phone_number
LEFT JOIN customer_status cs ON cs.id=c.status
LEFT JOIN users u ON u.unique_id=p.user_unique_id
LEFT JOIN sell_point sl ON sl.id=u.sell_point_id
WHERE (p.call_state='${callStatus.ACCEPTED}')
%s
%s ;
`;


export const getMissedCallAdmin = `
SELECT p.*, COALESCE(c.fullname, '--------') as user_full_name,c.address_home,c.address_work,cs.value AS user_status,c.unique_id as customer_unique_id,
u.fullname AS operator_fullname,sl.name AS sell_point_name,
(SELECT COUNT(p3.*) FROM phone_call p3 WHERE p3.phone_number=p.phone_number) AS all_call_history_count,
(SELECT array_to_json(array_agg(p2.*)) FROM phone_call p2 WHERE p.phone_number=p2.phone_number) AS call_history
FROM phone_call p 
LEFT JOIN customer c ON c.phone_number=p.phone_number
LEFT JOIN customer_status cs ON cs.id=c.status
LEFT JOIN users u ON u.unique_id=p.user_unique_id
LEFT JOIN sell_point sl ON sl.id=u.sell_point_id
WHERE (p.call_state='${callStatus.REJECTED}' OR p.call_state='${callStatus.ACCEPTED_AFTER_REJECTED}')
%s
%s 
LIMIT $2 OFFSET ($3 - 1) * $2;
`;

export const getMissedCallAdminCount = `
SELECT p.*, COALESCE(c.fullname, '--------') as user_full_name,c.address_home,c.address_work,cs.value AS user_status,c.unique_id as customer_unique_id,
u.fullname AS operator_fullname,sl.name AS sell_point_name,
(SELECT COUNT(p3.*) FROM phone_call p3 WHERE p3.phone_number=p.phone_number) AS all_call_history_count,
(SELECT array_to_json(array_agg(p2.*)) FROM phone_call p2 WHERE p.phone_number=p2.phone_number) AS call_history
FROM phone_call p 
LEFT JOIN customer c ON c.phone_number=p.phone_number
LEFT JOIN customer_status cs ON cs.id=c.status
LEFT JOIN users u ON u.unique_id=p.user_unique_id
LEFT JOIN sell_point sl ON sl.id=u.sell_point_id
WHERE (p.call_state='${callStatus.REJECTED}' OR p.call_state='${callStatus.ACCEPTED_AFTER_REJECTED}')
%s
%s ;
`;


export const addCustomer = `
INSERT INTO customer(
	fullname, phone_number, question_mode, find_us, address_home, address_work, information, created_at, updated_at, unique_id, operator_unique_id, speak_mode, status, speak_tone, speak_accent, focus_word)
	VALUES ($1, $2, $3, $4, $5, $6, $7, now(), now(), $8, $9, $10, $11, $12, $13, $14) RETURNING *;
`;

export const addCustomerInterestedProducts = `
INSERT INTO customer_interested_product(
	interested_product_name, interested_product_size, interested_product_color, status, created_at, updated_at, unique_id, customer_unique_id,operator_unique_id)
	VALUES %L RETURNING *;
`;


export const editCustomer = `
UPDATE customer
SET fullname=$1, question_mode=$2, find_us=$3, address_home=$4, address_work=$5, information=$6, updated_at=now(), operator_unique_id=$7, speak_mode=$8, status=$9, speak_tone=$10, speak_accent=$11, focus_word=$12
WHERE unique_id=$13 RETURNING *;
`;


export const getCustomers = `
SELECT c.*,s1.value AS speak_mode_text,
s2.value AS customer_status_text,
s3.value AS speak_tone_text,
s4.value AS speak_accent_text,
s5.value AS focus_word_text,
(SELECT COUNT(o.id) FROM customer_order o WHERE o.customer_unique_id=c.unique_id) AS order_count,
(SELECT array_to_json(array_agg(p.*)) FROM customer_interested_product p WHERE p.customer_unique_id=c.unique_id) AS interested_products
FROM customer c
LEFT JOIN speak_mode s1 ON s1.id=c.speak_mode
LEFT JOIN customer_status s2 ON s2.id=c.status
LEFT JOIN speak_tone s3 ON s3.id=c.speak_tone
LEFT JOIN speak_accent s4 ON s4.id=c.speak_accent
LEFT JOIN focus_word s5 ON s5.id=c.focus_word
%s
%s 
LIMIT $1 OFFSET ($2 - 1) * $1;
`;

export const getSingleCustomerQuery = `
SELECT c.*,s1.value AS speak_mode_text,
s2.value AS customer_status_text,
s3.value AS speak_tone_text,
s4.value AS speak_accent_text,
s5.value AS focus_word_text,
(SELECT array_to_json(array_agg(p.*)) FROM customer_interested_product p WHERE p.customer_unique_id=c.unique_id) AS interested_products,
(SELECT COUNT(p3.*) FROM phone_call p3 WHERE p3.phone_number=c.phone_number) AS all_call_history_count,
(SELECT array_to_json(array_agg(p2.*)) FROM phone_call p2 WHERE c.phone_number=p2.phone_number) AS call_history
FROM customer c
LEFT JOIN speak_mode s1 ON s1.id=c.speak_mode
LEFT JOIN customer_status s2 ON s2.id=c.status
LEFT JOIN speak_tone s3 ON s3.id=c.speak_tone
LEFT JOIN speak_accent s4 ON s4.id=c.speak_accent
LEFT JOIN focus_word s5 ON s5.id=c.focus_word
WHERE c.unique_id = $1
`;

export const getCustomersPageCount = `
SELECT c.*,s1.value AS speak_mode_text,
s2.value AS customer_status_text,
s3.value AS speak_tone_text,
s4.value AS speak_accent_text,
s5.value AS focus_word_text,
(SELECT array_to_json(array_agg(p.*)) FROM customer_interested_product p WHERE p.customer_unique_id=c.unique_id) AS interested_products
FROM customer c
LEFT JOIN speak_mode s1 ON s1.id=c.speak_mode
LEFT JOIN customer_status s2 ON s2.id=c.status
LEFT JOIN speak_tone s3 ON s3.id=c.speak_tone
LEFT JOIN speak_accent s4 ON s4.id=c.speak_accent
LEFT JOIN focus_word s5 ON s5.id=c.focus_word
%s
%s
`;

// Add order


export const addOrder = `
INSERT INTO customer_order(
	unique_id, is_express, created_at, updated_at, additional_information, customer_unique_id, operator_unique_id)
	VALUES ($1,$2,now(),now(),$3,$4,$5) RETURNING *;
`;

export const addOrderProduct = `
INSERT INTO customer_order_product(
	customer_order_unique_id, 
	product_name, 
	product_brand, 
	product_model, 
	product_artikul_code, 
	product_debt_price, 
	product_cash_price, 
	product_discount, 
	product_size, 
	product_color, 
	product_count, 
	unique_id, 
	created_at, 
	updated_at, 
	reason, 
	operator_unique_id)
	VALUES %L RETURNING *
`;

export const addOrderAddress = `
INSERT INTO customer_order_address_history(
	customer_order_unique_id, address, user_unique_id, created_at, updated_at, reason,unique_id)
	VALUES ($1,$2,$3,now(),now(), $4,$5) RETURNING *;
`;

export const addOrderCourier = `
INSERT INTO customer_order_courier_history(
	customer_order_unique_id, courier_unique_id, operator_unique_id, created_at, updated_at, reason,unique_id)
	VALUES ($1,$2,$3, now(), now(),$4,$5) RETURNING *;
`;

export const addOrderDate = `
INSERT INTO customer_order_date_history(
	customer_order_unique_id, order_date, order_time, user_unique_id, created_at, updated_at, reason,unique_id)
	VALUES ($1,$2,$3,$4, now(), now(), $5,$6) RETURNING *;
`;

export const addOrderDeliveryPrice = `
INSERT INTO customer_order_delivery_price(
	customer_order_unique_id, user_unique_id, delivery_price, reason, created_at, updated_at,unique_id)
	VALUES ($1, $2,$3,$4,now(),now(),$5) RETURNING *;
`;

export const addOrderLocationHistory = `
INSERT INTO customer_order_location_history(
	customer_order_unique_id, user_unique_id, latitude, longitude, reason, created_at, updated_at,unique_id)
	VALUES ($1, $2, $3, $4, $5, now(), now(),$6) RETURNING *;
`;

export const addOrderProductStatus = `
INSERT INTO customer_order_product_status_history(
	customer_order_product_unique_id, status, user_unique_id, created_at, updated_at, reason,unique_id)
	VALUES %L RETURNING *;
`;

export const addOrderStatus = `
INSERT INTO customer_order_status_history(
	customer_order_unique_id, status, reason, user_unique_id, created_at, updated_at,unique_id)
	VALUES ($1, $2,$3, $4,now(), now(),$5) RETURNING *;
`;

export const getField = `
SELECT now(),
(SELECT array_to_json(array_agg(f.*)) FROM focus_word f) AS focus_word,
(SELECT array_to_json(array_agg(f1.*)) FROM find_us f1) AS find_us,
(SELECT array_to_json(array_agg(a.*)) FROM speak_accent a) AS speak_accent,
(SELECT array_to_json(array_agg(m.*)) FROM speak_mode m) AS speak_mode,
(SELECT array_to_json(array_agg(t.*)) FROM speak_tone t) AS speak_tone,
(SELECT array_to_json(array_agg(s.*)) FROM customer_status s) AS customer_status
`;

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
    (SELECT CASE WHEN s.created_at IS NULL THEN now()
                 ELSE s.created_at
            END
        FROM customer_order_status_history s WHERE s.customer_order_unique_id=o.unique_id ORDER BY s.created_at DESC LIMIT 1) as current_status
    FROM customer_order o
    LEFT JOIN customer c ON c.unique_id=o.customer_unique_id
    WHERE (SELECT ch.status FROM customer_order_status_history ch 
        WHERE ch.customer_order_unique_id=o.unique_id ORDER BY ch.updated_at DESC LIMIT 1) = $1
        AND 
        (SELECT co.courier_unique_id FROM customer_order_courier_history co 
        WHERE co.customer_order_unique_id=o.unique_id ORDER BY co.updated_at DESC LIMIT 1) = $2
    ORDER BY o.created_at ASC;
`;


export const changeOrderStatus = `
    INSERT INTO public.customer_order_status_history(
        customer_order_unique_id, status, reason, user_unique_id, created_at, updated_at,unique_id)
        VALUES ($1, $2, $3, $4, now(), now(),$5) RETURNING *;
`;


export const changeOrderCourier = `
INSERT INTO public.customer_order_courier_history(
        customer_order_unique_id, courier_unique_id, operator_unique_id, created_at, updated_at, reason,unique_id)
        VALUES ($1, $2, $3, now(),now(), $4,$5) RETURNING *;
`;

export const changeOrderLocation = `
INSERT INTO public.customer_order_location_history(
        customer_order_unique_id, user_unique_id, latitude, longitude, reason, created_at, updated_at,unique_id)
        VALUES ($1, $2, $3, $4, $5, now(), now(),$6) RETURNING *;
`;

export const changeOrderDate = `
INSERT INTO public.customer_order_date_history(
        customer_order_unique_id, order_date, order_time, user_unique_id, created_at, updated_at, reason,unique_id)
        VALUES ($1, $2, $3, $4, now(), now(), $5,$6) RETURNING *;
`;

export const changeOrderDeliveryPrice = `
INSERT INTO public.customer_order_delivery_price(
        customer_order_unique_id, user_unique_id, delivery_price, reason, created_at, updated_at,unique_id)
        VALUES ($1, $2, $3, $4,now(), now(),$5) RETURNING *;
`;

export const changeOrderAddress = `
INSERT INTO public.customer_order_address_history(
        customer_order_unique_id, address, user_unique_id, created_at, updated_at, reason,unique_id)
        VALUES ($1, $2, $3, now(), now(), $4,$5) RETURNING *;
`;

export const changeOrderProductStatus = `
INSERT INTO customer_order_product_status_history(
	customer_order_product_unique_id, status, user_unique_id, created_at, updated_at, reason,unique_id)
	VALUES ($1,$2, $3, now(),now(), $4,$5) RETURNING *;
`;

export const getOrders = `
SELECT c.id,c.unique_id,
    c.is_express,
    c.created_at,
    c.updated_at,
    c.additional_information,
    c.customer_unique_id,
    c.operator_unique_id,
    cus.fullname,
    cus.phone_number,
    cus.address_home,
    cus.address_work,
    cor.fullname AS courier_fullname,
    cor.phone_number AS courier_phone_number,
    uss.fullname AS operator_fullname,
    (SELECT array_to_json(array_agg(json_build_object('res',addr.*,'operator',uu.fullname,'courier',cc.fullname))) FROM customer_order_address_history addr
LEFT JOIN users uu ON uu.unique_id=addr.user_unique_id
LEFT JOIN courier cc ON cc.unique_id=addr.user_unique_id
WHERE addr.customer_order_unique_id=c.unique_id) AS address_history,

    (SELECT array_to_json(array_agg(json_build_object('res',courier.*,'operator',uu.fullname,'courier',cc.fullname))) FROM customer_order_courier_history courier
LEFT JOIN users uu ON uu.unique_id=courier.operator_unique_id
LEFT JOIN courier cc ON cc.unique_id=courier.courier_unique_id
WHERE courier.customer_order_unique_id=c.unique_id) AS courier_history,


    (SELECT array_to_json(array_agg(json_build_object('res',d.*,'operator',uu.fullname,'courier',cc.fullname))) FROM customer_order_date_history d
LEFT JOIN users uu ON uu.unique_id=d.user_unique_id
LEFT JOIN courier cc ON cc.unique_id=d.user_unique_id
WHERE d.customer_order_unique_id=c.unique_id) AS date_history,

    (SELECT array_to_json(array_agg(json_build_object('res',price.*,'operator',uu.fullname,'courier',cc.fullname))) FROM customer_order_delivery_price price
LEFT JOIN users uu ON uu.unique_id=price.user_unique_id
LEFT JOIN courier cc ON cc.unique_id=price.user_unique_id
WHERE price.customer_order_unique_id=c.unique_id) AS delivery_price_history,


    (SELECT array_to_json(array_agg(json_build_object('res',loc.*,'operator',uu.fullname,'courier',cc.fullname))) FROM customer_order_location_history loc
LEFT JOIN users uu ON uu.unique_id=loc.user_unique_id
LEFT JOIN courier cc ON cc.unique_id=loc.user_unique_id
WHERE loc.customer_order_unique_id=c.unique_id) AS location_history,



    (SELECT array_to_json(array_agg(json_build_object('res',st.*,'operator',uu.fullname,'courier',cc.fullname))) FROM customer_order_status_history st
LEFT JOIN users uu ON uu.unique_id=st.user_unique_id
LEFT JOIN courier cc ON cc.unique_id=st.user_unique_id
WHERE st.customer_order_unique_id=c.unique_id) AS status_history,

    (SELECT array_to_json(array_agg(p.*)) FROM customer_order_product p WHERE p.customer_order_unique_id=c.unique_id) AS products
FROM customer_order c
LEFT JOIN customer cus ON cus.unique_id=c.customer_unique_id
LEFT JOIN users uss ON uss.unique_id=c.operator_unique_id
LEFT JOIN courier cor ON cor.unique_id=(SELECT courier.courier_unique_id FROM customer_order_courier_history courier WHERE courier.customer_order_unique_id=c.unique_id ORDER BY updated_at DESC LIMIT 1)

%s
%s
LIMIT $1 OFFSET ($2 - 1) * $1;
`;



export const getOrdersCount = `
SELECT c.id,c.unique_id, 
c.is_express, 
c.created_at, 
c.updated_at, 
c.additional_information,
c.customer_unique_id, 
c.operator_unique_id,
cus.fullname,
cus.phone_number,
cus.address_home,
cus.address_work,
cor.fullname AS courier_fullname,
cor.phone_number AS courier_phone_number,
(SELECT array_to_json(array_agg(addr.*)) FROM customer_order_address_history addr WHERE addr.customer_order_unique_id=c.unique_id) AS address_history,
(SELECT array_to_json(array_agg(courier.*)) FROM customer_order_courier_history courier WHERE courier.customer_order_unique_id=c.unique_id) AS courier_history,
(SELECT array_to_json(array_agg(d.*)) FROM customer_order_date_history d WHERE d.customer_order_unique_id=c.unique_id) AS date_history,
(SELECT array_to_json(array_agg(price.*)) FROM customer_order_delivery_price price WHERE price.customer_order_unique_id=c.unique_id) AS delivery_price_history,
(SELECT array_to_json(array_agg(loc.*)) FROM customer_order_location_history loc WHERE loc.customer_order_unique_id=c.unique_id) AS location_history,
(SELECT array_to_json(array_agg(st.*)) FROM customer_order_status_history st WHERE st.customer_order_unique_id=c.unique_id) AS status_history,
(SELECT array_to_json(array_agg(p.*)) FROM customer_order_product p WHERE p.customer_order_unique_id=c.unique_id) AS products
FROM customer_order c
LEFT JOIN customer cus ON cus.unique_id=c.customer_unique_id
LEFT JOIN users uss ON uss.unique_id=c.operator_unique_id
LEFT JOIN courier cor ON cor.unique_id=(SELECT courier.courier_unique_id FROM customer_order_courier_history courier WHERE courier.customer_order_unique_id=c.unique_id ORDER BY updated_at DESC LIMIT 1)
%s
%s
`;


export const getOrderProductHistory = `
SELECT id, customer_order_product_unique_id, status, user_unique_id, created_at, updated_at, reason
	FROM customer_order_product_status_history
	WHERE customer_order_product_unique_id IN (%L);
`;

export const getSellPointId = `SELECT sell_point_id
FROM users WHERE unique_id=$1;`;

export const getCouriers = `
SELECT id, fullname, username, password, phone_number, status, created_at, updated_at, user_role, date_of_birthday, work_start_date, sell_point_id, unique_id
	FROM courier WHERE sell_point_id IS NULL OR sell_point_id = $1;
`;

export const addCourier = `
INSERT INTO courier(
    fullname, username, password, phone_number, status, created_at, updated_at, user_role, date_of_birthday, work_start_date, sell_point_id, unique_id)
    VALUES ($1, $2, $3, $4, $5, now(), now(), $6, $7, $8, $9, $10) RETURNING *;
`;

export const getCouriersByFilter = `
    SELECT c.*,
    (SELECT COUNT(cc.id) FROM customer_order_courier_history cc WHERE cc.courier_unique_id=c.unique_id) as order_count,
    (SELECT cc.customer_order_unique_id FROM customer_order_courier_history cc WHERE cc.courier_unique_id=c.unique_id ORDER BY cc.created_at DESC LIMIT 1) as last_order_id,
    (SELECT oc.status FROM customer_order_status_history oc WHERE oc.customer_order_unique_id=
    (SELECT cc.customer_order_unique_id FROM customer_order_courier_history cc WHERE cc.courier_unique_id=c.unique_id ORDER BY cc.created_at DESC LIMIT 1) ORDER BY oc.created_at DESC LIMIT 1) as last_order_status
    FROM courier c WHERE c.sell_point_id=$1 OR c.sell_point_id IS NULL;
`;

export const addInboxQuery = `
INSERT INTO inbox(
        title, message, link_to_goal, is_read, is_delete, created_at, updated_at, unique_id, from_unique_id, to_unique_id)
        VALUES ($1, $2, $3, $4, $5, now(), now(), $6, $7, $8) RETURNING *;
`;

export const deleteInbox = `
UPDATE inbox
    SET  is_delete=true, updated_at=now()
    WHERE unique_id=$1 RETURNING *;
`;

export const markAsRead = `
UPDATE inbox
    SET  is_read=true, updated_at=now()
    WHERE unique_id=$1 RETURNING *;
`;

export const getInboxQuery = `
    SELECT i.id, 
    i.title, i.message, i.link_to_goal, 
    i.is_read, i.is_delete, i.created_at, 
    i.updated_at, i.unique_id, i.from_unique_id, i.to_unique_id,
    u.fullname as sender_name,u2.fullname as receiver_name, c.fullname as sender_courier_name, c2.fullname as receiver_courier_name
    FROM inbox i
    LEFT JOIN users u ON u.unique_id = i.from_unique_id
    LEFT JOIN users u2 ON u2.unique_id = i.to_unique_id
    LEFT JOIN courier c ON c.unique_id = i.from_unique_id
    LEFT JOIN courier c2 ON c2.unique_id = i.to_unique_id
    WHERE (from_unique_id = $1 OR to_unique_id = $1) AND is_delete=false
    ORDER BY created_at DESC
    LIMIT $2 OFFSET ($3 - 1) * $2;
`;

export const getInboxCountQuery = `
    SELECT id
    FROM inbox 
    WHERE (from_unique_id = $1 OR to_unique_id = $1) AND is_delete=false
    ORDER BY created_at DESC
`;

export const getUnReadInboxCountQuery = `
    SELECT count(id) as unread_inbox_count
    FROM inbox 
    WHERE (from_unique_id = $1 OR to_unique_id = $1) AND is_read=false AND is_delete=false
`;

export const getFcmToken = `
    SELECT DISTINCT token FROM fcm_token WHERE user_unique_id=$1;
`;

export const getCourierUniqueId = `
    SELECT courier_unique_id
    FROM customer_order_courier_history WHERE customer_order_unique_id=$1 ORDER BY updated_at DESC LIMIT 1;
`;

export const getAllCustomer = `
SELECT id, fullname, phone_number, question_mode, find_us, address_home, address_work, information, created_at, updated_at, unique_id, operator_unique_id, speak_mode, status, speak_tone, speak_accent, focus_word
    FROM public.customer;
`;


export const updateOrderInfo = `
UPDATE public.customer_order
    SET is_express=$1, updated_at='now()', additional_information=$2, customer_unique_id=$3
    WHERE unique_id=$4;
`;




