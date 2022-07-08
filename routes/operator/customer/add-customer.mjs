import express from "express";
import format from "pg-format";
import { verifyToken } from "../../../modules/auth/token.mjs";
import { db } from "../../../modules/database/connection.mjs";
import {
  addCustomer,
  addCustomerInterestedProducts,
} from "../../../modules/query/operator-query.mjs";
import { badRequest,response } from "../../../modules/response.mjs";
import { generateUUID } from "../../../modules/uuid/uuid.mjs";

const addCustomerRouter = express.Router();

addCustomerRouter.post("/", verifyToken, async (req, res) => {
  if (
    typeof req.body === "undefined" ||
    req.body == null ||
    req.user == null ||
    typeof req.user === "undefined"
  ) {
    badRequest(req, res);
  } else {
    const {
      fullname,
      phone_number,
      question_mode,
      find_us,
      address_home,
      address_work,
      information,
      speak_mode,
      status,
      speak_tone,
      speak_accent,
      focus_word,
      interested_products
    } = req.body;
    let customerUniqueId = generateUUID();

    let addedCustomer = {};

    await db
      .query(addCustomer, [
        fullname,
        phone_number,
        question_mode,
        find_us,
        address_home,
        address_work,
        information,
        customerUniqueId,
        req.user.user.unique_id,
        speak_mode,
        status,
        speak_tone,
        speak_accent,
        focus_word,
      ])
      .then((result) => {
        if (result.rows.length) {
          customerUniqueId = result.rows[0].unique_id;
          addedCustomer = result.rows[0];
        }
      })
      .catch((err) => {
        badRequest(req, res);
        return;
      });

    if (
      typeof interested_products === "undefined" ||
      interested_products == null
    ) {
      interested_products = [];
    }
    let values = [];
    if (interested_products.length > 0) {
      interested_products.forEach((item, i) => {
        // interested_product_name, interested_product_size, interested_product_color, status, created_at, updated_at, unique_id, customer_unique_id
        values.push([
          item.interested_product_name,
          item.interested_product_size,
          item.interested_product_color,
          1,
          "now()",
          "now()",
          generateUUID(),
          customerUniqueId,
          req.user.user.unique_id
        ]);
      });
    }

    if (values.length > 0) {
      let addInterestingProduct = format(addCustomerInterestedProducts, values);
      await db
        .query(addInterestingProduct)
        .then((result) => {
            if(result.rows.length){
                res.json(response(false,'success',{
                    customer:addedCustomer,
                    interested_products:result.rows
                }));
                res.end();
            } else {
                res.json(response(false,'success',{
                    customer:addedCustomer,
                    interested_products:[]
                }));
                res.end();
            }
        })
        .catch((err) => {
            res.json(response(false,'success',{
                customer:addedCustomer,
                interested_products:[]
            }));
            res.end();
        });
    } else {
        res.json(response(false,'success',{
            customer:addedCustomer,
            interested_products:[]
        }));
        res.end();
    }
  }
});

export { addCustomerRouter };
