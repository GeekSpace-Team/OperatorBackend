import express from "express";
import { verifyToken } from "../../../modules/auth/token.mjs";
import { loginType } from "../../../modules/constant/constant.mjs";
import { db } from "../../../modules/database/connection.mjs";
import { insertLoginHistory } from "../../../modules/query/operator-query.mjs";
import { badRequest, response, unauthorized } from "../../../modules/response.mjs";
import { generateUUID } from "../../../modules/uuid/uuid.mjs";

const logoutRouter = express.Router();
logoutRouter.post("/log-out", verifyToken, (req, res) => {
  if (typeof req.user === "undefined" || req.user == null) {
    unauthorized(req, res);
  } else {
    const uid = generateUUID();
    db.query(insertLoginHistory, [uid, req.user.user.unique_id, loginType.LOGOUT,req.body.device])
      .then((result) => {
        if(result.rows.length){
            res.json(response(false,'success',result.rows[0]));
        } else {
            badRequest(req, res);
            console.log("err");
        }
      })
      .catch((err) => {
        badRequest(req,res);
        console.log(err+"");
      });
  }
});
export { logoutRouter };
