export const getStatisticsQuery = `
    SELECT s.*,
    (SELECT  array_to_json(array_agg(op.*)) FROM customer_order_product op
        WHERE op.customer_order_unique_id IN (
            (SELECT o.unique_id FROM customer_order o
            WHERE o.operator_unique_id IN
                (SELECT  u.unique_id FROM users u WHERE u.sell_point_id=s.id) %s )
                    ) AND (
                (SELECT ps.status FROM customer_order_product_status_history ps WHERE ps.customer_order_product_unique_id=op.unique_id ORDER BY ps.created_at DESC LIMIT 1) = 'courier-delivered'
        )) as delivered_products,

    (SELECT  array_to_json(array_agg(op.*)) FROM customer_order_product op
        WHERE op.customer_order_unique_id IN (
            (SELECT o.unique_id FROM customer_order o
            WHERE o.operator_unique_id IN
            (SELECT  u.unique_id FROM users u WHERE u.sell_point_id=s.id) %s)
            ) AND (
            (SELECT ps.status FROM customer_order_product_status_history ps WHERE ps.customer_order_product_unique_id=op.unique_id ORDER BY ps.created_at DESC LIMIT 1) = 'rejected'
            )) as rejected_products
            FROM sell_point s;
`;


export const getOperatorStatisticsQuery=`
SELECT u1.*,
    (SELECT  array_to_json(array_agg(op.*)) FROM public.customer_order_product op
WHERE op.customer_order_unique_id IN (
    (SELECT o.unique_id FROM public.customer_order o
WHERE o.operator_unique_id = u1.unique_id %s
)
) AND (
    (SELECT ps.status FROM customer_order_product_status_history ps WHERE ps.customer_order_product_unique_id=op.unique_id ORDER BY ps.created_at DESC LIMIT 1) = 'courier-delivered'
)) as delivered_products,


    (SELECT  array_to_json(array_agg(op.*)) FROM public.customer_order_product op
WHERE op.customer_order_unique_id IN (
    (SELECT o.unique_id FROM public.customer_order o 
WHERE o.operator_unique_id = u1.unique_id %s
)
) AND (
    (SELECT ps.status FROM customer_order_product_status_history ps WHERE ps.customer_order_product_unique_id=op.unique_id ORDER BY ps.created_at DESC LIMIT 1) = 'rejected'
)) as rejected_products



FROM public.users u1
LEFT JOIN user_role r ON r.id=u1.user_role
WHERE u1.sell_point_id=$1 AND r.name='operator';
`;

export const loginQuery = `
SELECT u.*,r.name as role_name,
(SELECT array_to_json(array_agg(p.*)) FROM role_permission p WHERE p.user_role=u.user_role) as user_permissions
FROM users u 
LEFT JOIN user_role r ON r.id=u.user_role
LEFT JOIN sell_point s ON s.id=u.sell_point_id
WHERE u.username=$1 AND u.password=$2 AND (r.name='admin' OR r.name='superadmin' OR r.name='moderator');
`;

export const getCourierStatisticsQuery=`
SELECT u1.*,
    (SELECT  array_to_json(array_agg(op.*)) FROM public.customer_order_product op
WHERE op.customer_order_unique_id IN (
    (SELECT o.unique_id FROM public.customer_order o
WHERE o.unique_id IN (
    SELECT DISTINCT(cc.customer_order_unique_id)
FROM customer_order_courier_history cc WHERE cc.courier_unique_id=u1.unique_id AND cc.customer_order_unique_id NOT IN (
    SELECT cc1.customer_order_unique_id
FROM customer_order_courier_history cc1 WHERE cc1.courier_unique_id!=u1.unique_id ORDER BY cc1.created_at DESC
))
%s
)
) AND (
    (SELECT ps.status FROM customer_order_product_status_history ps WHERE ps.customer_order_product_unique_id=op.unique_id ORDER BY ps.created_at DESC LIMIT 1) = 'courier-delivered'
)) as delivered_products,


    (SELECT  array_to_json(array_agg(op.*)) FROM public.customer_order_product op
WHERE op.customer_order_unique_id IN (
    (SELECT o.unique_id FROM public.customer_order o
WHERE o.unique_id IN (
    SELECT DISTINCT(cc.customer_order_unique_id)
FROM customer_order_courier_history cc WHERE cc.courier_unique_id=u1.unique_id AND cc.customer_order_unique_id NOT IN (
    SELECT cc1.customer_order_unique_id
FROM customer_order_courier_history cc1 WHERE cc1.courier_unique_id!=u1.unique_id ORDER BY cc1.created_at DESC
))
%s
)
) AND (
    (SELECT ps.status FROM customer_order_product_status_history ps WHERE ps.customer_order_product_unique_id=op.unique_id ORDER BY ps.created_at DESC LIMIT 1) = 'rejected'
)) as rejected_products


FROM courier u1 WHERE u1.sell_point_id=$1;
`;


export const getUsersByRoleNameQuery=`
SELECT u.*,r.name as role_name,
(SELECT array_to_json(array_agg(p.*)) FROM role_permission p WHERE p.user_role=u.user_role) as user_permissions,
(SELECT array_to_json(array_agg(lh.*)) FROM login_history lh WHERE lh.user_unique_id=u.unique_id) as login_history
FROM users u 
LEFT JOIN user_role r ON r.id=u.user_role
LEFT JOIN sell_point s ON s.id=u.sell_point_id
WHERE r.name=$1;
`;


export const addUserQuery = `
INSERT INTO users(
    fullname, username, password, phone_number, status, user_role, sell_point_id, token, created_at, updated_at, work_start_date, date_of_birthday, unique_id, user_number)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'now()', 'now()', $9, $10, $11, $12) RETURNING *;
`;

export const updateUserQuery=`
UPDATE users
SET fullname=$1, username=$2, password=$3, phone_number=$4, 
status=$5, user_role=$6, sell_point_id=$7,  updated_at='now()', 
work_start_date=$8, date_of_birthday=$9,user_number=$10
    WHERE unique_id=$11 RETURNING *;
`;

export const deleteUserQuery=`
DELETE FROM public.users WHERE unique_id=$1;
`;


export const getSellPointQuery=`
    SELECT id, name, address, phone_number, latitude, longitude, created_at, updated_at, unique_id
    FROM public.sell_point ORDER BY created_at DESC;
`;

export const addSellPointQuery=`
INSERT INTO public.sell_point(
    name, address, phone_number, latitude, longitude, created_at, updated_at, unique_id)
    VALUES ($1, $2, $3,$4, $5, 'now()', 'now()', $6) RETURNING *;
`;

export const updateSellPointQuery=`
UPDATE public.sell_point
    SET name=$1, address=$2, phone_number=$3, latitude=$4, longitude=$5, updated_at='now()'
    WHERE unique_id=$6 RETURNING *;
`;

export const deleteSellPointQuery=`
    DELETE FROM sell_point WHERE unique_id=$1;
`;

export const getInfoQuery=`
SELECT i.* FROM %s i ORDER BY i.created_at DESC;
`;


export const addInfoQuery=`
INSERT INTO %s (
    value, status, created_at, updated_at)
    VALUES ($1, 1, now(), now()) RETURNING *;
`;


export const updateInfoQuery=`
UPDATE %s
    SET value=$1, updated_at=now()
    WHERE id=$2 RETURNING *;
`;


export const deleteInfoQuery=`
DELETE FROM %s WHERE id=$1;
`;


export const getUserRoleQuery=`
    SELECT ur.*,
        (SELECT array_to_json(array_agg(rp.*)) FROM role_permission rp WHERE rp.user_role=ur.id) as permissions
    FROM user_role ur ORDER BY ur.created_at DESC;
`;

export const addUserRoleQuery=`
INSERT INTO user_role(
    name, created_at, updated_at)
    VALUES ($1, now(), now()) RETURNING *;
`;

export const addUserRolePermissions=`
INSERT INTO role_permission(
    permission, can_read, can_write, can_edit, can_delete, user_role, created_at, updated_at)
    VALUES %L RETURNING *;
`;

export const updateUserRoleQuery=`
UPDATE user_role
    SET name=$1,updated_at=now()
    WHERE id=$2 RETURNING *;
`;

export const deleteUserRoleQuery=`
DELETE FROM role_permission WHERE user_role=$1;
`;

export const deleteUserRoleQ=`
DELETE FROM user_role WHERE id=$1;
`;


export const getCouriersQuery=`
SELECT u.*,r.name as role_name,
(SELECT array_to_json(array_agg(p.*)) FROM role_permission p WHERE p.user_role=u.user_role) as user_permissions,
(SELECT array_to_json(array_agg(lh.*)) FROM login_history lh WHERE lh.user_unique_id=u.unique_id) as login_history
FROM courier u 
LEFT JOIN user_role r ON r.id=u.user_role
LEFT JOIN sell_point s ON s.id=u.sell_point_id
ORDER BY u.created_at DESC
`;


export const addCourierQuery = `
INSERT INTO courier(
    fullname, username, password, phone_number, status, user_role, sell_point_id, token, created_at, updated_at, work_start_date, date_of_birthday, unique_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'now()', 'now()', $9, $10, $11) RETURNING *;
`;

export const updateCourierQuery=`
UPDATE courier
SET fullname=$1, username=$2, password=$3, phone_number=$4, 
status=$5, user_role=$6, sell_point_id=$7,  updated_at='now()', 
work_start_date=$8, date_of_birthday=$9
    WHERE unique_id=$10 RETURNING *;
`;

export const deleteCourierQuery=`
DELETE FROM public.courier WHERE unique_id=$1;
`;

export const addCancelReasonQuery=`
INSERT INTO public.cancel_reason(
    unique_id, sell_point_id, reason, created_at, updated_at)
    VALUES ($1, $2, $3, now(), now()) RETURNING *;
`;

export const updateCancelReasonQuery=`
UPDATE public.cancel_reason
    SET  sell_point_id=$1, reason=$2, updated_at=now()
    WHERE unique_id=$3 RETURNING *;
`;

export const deleteCancelReasonQuery=`
DELETE FROM public.cancel_reason WHERE unique_id=$1;
`;

export const getCancelReasonQuery=`
SELECT c.*,s.name as sell_point_name FROM public.cancel_reason c
LEFT JOIN sell_point s ON s.id=CAST(coalesce(c.sell_point_id, '0') AS integer)
 ORDER BY created_at DESC;
`;