import express from "express";
import { badRequest, response } from "../../../modules/response.mjs";
import { socket_io } from "../../../index.mjs";
import { verifyToken } from "../../../modules/auth/token.mjs";
import {
  callDirection,
  callState,
  callStatus,
} from "../../../modules/constant/constant.mjs";
import { db } from "../../../modules/database/connection.mjs";
import {
  insertPhoneCall,
  selectCustomerByPhoneNumber,
  selectPhoneCallByUniqueId,
  updateByLastCallState,
  updatePhoneCall,
} from "../../../modules/query/operator-query.mjs";


const ringingCallRouter = express.Router();

const callDataChanger = (req, res, next) => {
    let direction;
    
    if (req.body.callType == callDirection.INCOMING) {
        req.body.callTypeStr = "Giriş jaň";
        direction = callDirection.INCOMING;
    }
    if(req.body.callType == callDirection.OUTGOING){
      req.body.callTypeStr = "Çykyş jaň";
      direction = callDirection.OUTGOING;
    }
        
    switch (req.body.state) {
      case callState.CALL_STATE_START:
        req.body.callStateStr = "Jaň başlanýar...";
        break;
      case callState.CALL_STATE_RINGING:
        req.body.callStateStr = "Jaň edilýär...";
        break;
      case callState.CALL_STATE_OFFHOOK:
        if (direction == callDirection.OUTGOING) {
          req.body.callStateStr = "Jaň edilýär...";
        } else {
          req.body.callStateStr = "Jaň alyndy";
        }
        break;
      case callState.CALL_STATE_IDLE:
        req.body.callStateStr = "Jaň tamamlandy";
        break;
    }
    next();
  };
  
  ringingCallRouter.post(
    "/",
    verifyToken,
    callDataChanger,
    async (req, res) => {
      if (typeof req.body === "undefined" || req.body == null) {
        badRequest(req, res);
        return;
      }
  
      let customer = {};
  
      await db
        .query(selectCustomerByPhoneNumber, [req.body.phNumber])
        .then((result) => {
          if (result.rows.length) {
            customer = result.rows;
          }
        })
        .catch((err) => {
          customer = {};
        });
      let exist = false;
      await db
        .query(selectPhoneCallByUniqueId, [req.body.uniqueId, req.body.phNumber])
        .then((result) => {
          if (result.rows.length) {
            exist = true;
            console.log("exist");
          } else {
            exist = false;
          }
        })
        .catch((err) => {
          exist = false;
        });
  
      console.log(req.body.callDuration);
      const data = {
        operator: req.user.user,
        call: req.body,
        customer: customer,
      };
      socket_io.emit("onCall", data);
      let callState = 0;
  
      if (req.body.callDuration < 10) {
        callState = callStatus.REJECTED;
      } else if (req.body.callDuration >= 10) {
        callState = callStatus.ACCEPTED;
      }
  
      if (callState == callStatus.ACCEPTED) {
        await db
          .query(updateByLastCallState, [
            callStatus.ACCEPTED_AFTER_REJECTED,
            req.body.phNumber,
          ])
          .then((result) => {})
          .catch((err) => {});
      }
  
      if (exist) {
        await db
          .query(updatePhoneCall, [
            req.body.phNumber,
            req.body.contactName,
            req.body.callType,
            req.body.callDate,
            req.body.callTime,
            req.body.callDuration,
            req.body.state,
            req.user.user.unique_id,
            callState,
            req.body.uniqueId,
          ])
          .then((result) => {
            if (result.rows.length) {
              console.log("Updated");
            } else {
              console.log("Not-Updated");
            }
          })
          .catch((err) => {
            console.error(err + " Updated");
          });
      } else {
        await db
          .query(insertPhoneCall, [
            req.body.phNumber,
            req.body.contactName,
            req.body.callType,
            req.body.callDate,
            req.body.callTime,
            req.body.callDuration,
            req.body.uniqueId,
            req.body.state,
            req.user.user.unique_id,
            callState,
          ])
          .then((result) => {
            if (result.rows.length) {
              console.log("Inserted");
            } else {
              console.log("Not-Inserted");
            }
          })
          .catch((err) => {
            console.error(err + " Inserted");
          });
      }
  
      res.json(response(false, "success", "success"));
    }
  );

  export {ringingCallRouter};