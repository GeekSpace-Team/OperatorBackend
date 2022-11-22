import { db } from "../database/connection.mjs";
import { pusher } from "../fcm/fcm.mjs";
import { getFcmToken } from "../query/operator-query.mjs";

export const sendMessage = async(unique_id,title,body,data) => {
    await db.query(getFcmToken,[unique_id])
        .then(result_token=>{
            if(result_token.rows.length){
                const registrationTokens = [];
                result_token.rows.map(row=>{
                    if(row.token!=null && row.token!==''){
                        registrationTokens.push(row.token);
                    }
                });
                const message = {
                    notification: {
                        title: title,
                        body: body,
                        priority: "high",
                    },
                    data: data,
                    tokens: registrationTokens,
                    android: {
                        priority: 'high',
                        notification: {
                            sound: 'default',
                            priority: "high",
                        }
                    },
                      apns: {
                        payload: {
                            aps: {
                                sound: 'default',
                                priority: "high",
                            },
                        },
                    }
                };
                const options = {
                    priority: 'high'
                };
                pusher.messaging().sendToDevice(registrationTokens,message,options)
                    .then((response)=>{
                        console.log(response.successCount + ' messages were sent successfully');
                    })
            }
        }).catch(error=>{
            console.log(error);
        });
}