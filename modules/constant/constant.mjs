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

// LIMIT $1 OFFSET ($2 - 1) * $1;