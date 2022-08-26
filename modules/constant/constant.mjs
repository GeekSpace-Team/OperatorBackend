export const secret_key = "FG[uvt+kx.LT~c]:&R<$K[L7|`?&[s$,H),^&ObI-RW6:1$*Z];pkAWWgn:6$(";

export const callDirection = {
    INCOMING:0,
    OUTGOING:1
};

export const callState = {
    CALL_STATE_START:-2,
    CALL_STATE_RINGING:1,
    CALL_STATE_OFFHOOK:2,
    CALL_STATE_IDLE:0
};

export const orderStatus = {
    NONE:'none',
    PENDING:'pending',
    COURIER_PENDING:'courier-pending',
    COURIER_ACCEPTED:'courier-accepted',
    COURIER_DELIVERED:'courier-delivered',
    DELIVERED:'delivered',
    REJECTED:'rejected'
};



export const webPermission = {
    RINGING_CALL:'ringing-call', // gelyan janlar
    ACCEPTED_CALL:'accepted-call', // Kabul edilen janlar
    REJECTED_CALL:'rejected-call', // Goyberilen janlar
    CUSTOMERS:'customer', // Musderiler
    COURIER:'courier', // Eltip berijiler
    STAFF:'staff', // moderator, admin
    SELL_POINTS:'sell-points', // satysh nokatlary
    FIELDS:'fields', // gurleyish tony, gurleyish aheni we sh.m
    OPERATOR:'operator', // operatorlar
    ORDERS:'orders', // sargytlar
    INBOX:'inbox', // hatlar
};

export const loginType = {
    LOGIN:1,
    LOGOUT:0
};


export const callStatus = {
    ACCEPTED:2,
    REJECTED:3,
    ACCEPTED_AFTER_REJECTED:4
};

export const INFO_TYPES = {
    CUSTOMER_STATUS:'customer_status',
    SPEAK_MODE:'speak_mode',
    SPEAK_ACCENT:'speak_accent',
    FOCUS_WORD:'focus_word',
    SPEAK_TONE:'speak_tone',
    FIND_US:'find_us'
};

export const tables={
    customer:"customer",
    customer_interested_product:"customer_interested_product",
    user_role:"user_role",
    speak_tone:"speak_tone",
    speak_mode:"speak_mode",
    speak_accent:"speak_accent",
    sell_point:"sell_point",
    role_permission:"role_permission",
    focus_word:"focus_word",
    customer_status:"customer_status",
    cancel_reason:"cancel_reason",
    courier:"courier",
    users:"users",
    inbox:"inbox",
    customer_order:"customer_order",
    customer_order_address_history:"customer_order_address_history",
    customer_order_courier_history:"customer_order_courier_history",
    customer_order_date_history:"customer_order_date_history",
    customer_order_delivery_price:"customer_order_delivery_price",
    customer_order_location_history:"customer_order_location_history",
    customer_order_product:"customer_order_product",
    customer_order_product_status_history:"customer_order_product_status_history",
    customer_order_status_history:"customer_order_status_history"
}

// LIMIT $1 OFFSET ($2 - 1) * $1;