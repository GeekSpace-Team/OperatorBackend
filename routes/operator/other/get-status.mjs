import express from 'express';
import {verifyToken} from "../../../modules/auth/token.mjs";
import {response} from "../../../modules/response.mjs";
import {callDirection, callState, callStatus, loginType, orderStatus} from "../../../modules/constant/constant.mjs";

const getStatus = express.Router();

getStatus.get('/',verifyToken,(req,res)=>{
    res.json(response(false,'success',{
        orderStatus:orderStatus,
        callDirection:callDirection,
        callState:callState,
        loginType:loginType,
        callStatus:callStatus,
        orderProductStatus:orderStatus
    }));
    res.end();
})

export {getStatus};