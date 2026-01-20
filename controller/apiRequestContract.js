// fix this
const axios = require('axios');
const https = require("https");
const count = require('./count.js');
const logger = require('../lib/logger.js');
const agent = new https.Agent({
    rejectUnauthorized: false,
});
const { pool } = require("../connection.js");
const config = require('../config.js');


async function sendTransactionRequest(name, table, body) {
  try {
    console.log(" Sending Kalp transaction");
    console.log("TX BODY:", JSON.stringify(body, null, 2));

    const response = await axios.post(
      "https://dev-kalp-service.p2eppl.com/transaction/send",
      body,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Basic ZGV2X2FkbWluOjEyMzQ1"
        },
        httpsAgent: agent,
        timeout: 15000
      }
    );

    console.log("Kalp response:", response.data);

    if (!response.data.success) {
      throw new Error("Kalp transaction failed");
    }

    const txHash = response.data.txHash;
    const transactionSentTime = new Date().toISOString();
    const tableName = table;

    // check if already exists
    const selectQuery = `
      SELECT * FROM ${tableName}
      WHERE transaction_hash = $1
    `;
    const selectResponse = await pool.query(selectQuery, [txHash]);

    if (selectResponse.rowCount) {
      logger.info(`Entry already exists for ${txHash}`);
      return;
    }

    // insert new tx
    const insertQuery = `
      INSERT INTO ${tableName}
      (transaction_hash, transaction_sent_time)
      VALUES ($1, NOW())
    `;

    await pool.query(insertQuery, [txHash]);

    logger.info(` Kalp tx sent ${txHash} for ${name}`);

  } catch (error) {
    if (error.response) {
      console.error(" API Error");
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(" Error:", error.message);
    }
  }
}


// Function to run the request periodically
async function runPeriodicRequest(name, table, body, time) {
    // Randomly pick between 2 and 3 minutes interval (in milliseconds)
    // const randomInterval = Math.floor(Math.random() * 60) * 1000 + 120000; // 120000 to 180000 ms (2 to 3 minutes)
    const randomInterval = time
    console.log(`Next request will be sent in: ${randomInterval / 1000} seconds`);

    // Run the request initially
    await sendTransactionRequest(name, table, body);

    // Run the request periodically (with the random interval)
    setInterval(async () => {
        await sendTransactionRequest(name, table, body);
    }, randomInterval);
}

module.exports = { runPeriodicRequest };






































































































































// Function to send the cURL request
// async function sendTransactionRequest(name, table, body) {
//     try {
//         console.log(`sending tx`);
//         const response = await axios.post(
//             `${config.transactionApiUrl}/sendTransaction`,
//             body,
//             {
//                 headers: { 'Content-Type': 'application/json' },
//                 httpsAgent: agent
//             },
//         );
//         count();
//         const transactionSentTime = new Date().toISOString();
//         console.log('Request sent successfully:', response.data);
//         //fetch transaction hash
//         const txHash = await getTransactionHash({ queueId: response.data.queueId });
//         //store in postgres
//         const tableName = table
//         // check if txHash already exists inside table , if yes then 
//         const selectQuery = `select * from ${tableName} where transaction_hash=$1`;
//         const selectResponse = await pool.query(selectQuery, [txHash]);
//         if (selectResponse.rowCount) {
//             logger.info(`Entry inside ${tableName} already exists for ${txHash}`);
//             // update the queueId, transaction_sent_time, time_Taken_ms
//             const timeTaken = new Date(selectResponse.rows[0].event_received_time) - new Date(transactionSentTime);
//             const updateQuery = `UPDATE ${tableName} SET queue_id=$1, transaction_sent_time=$2,time_taken_ms=$3 WHERE transaction_hash=$4`;
//             const updateResponse = await pool.query(updateQuery, [response.data.queueId, transactionSentTime, timeTaken, txHash]);
//             if (updateResponse.rowCount == 0) {
//                 logger.error(`Failed to update record for ${txHash} with queue_id ${response.data.queueId}`);
//             } else {
//                 logger.info(`Record updated for ${txHash} with queue_id ${response.data.queueId}`);
//             }
//             return;
//         }
//         const insertQuery = `INSERT INTO ${tableName} (queue_id, transaction_hash,transaction_sent_time) VALUES ($1, $2,NOW()) `;
//         const dbResponse = await pool.query(insertQuery, [response.data.queueId, txHash]);
//         if (dbResponse.rowCount == 0) {
//             logger.error(`Failed to insert record for ${txHash} with queue_id ${response.data.queueId}`);
//         } else {
//             logger.info(`Record inserted for ${txHash} with queue_id ${response.data.queueId}`);
//         }
//         logger.info(`tx sent ${txHash} for ${name}`);
//     } catch (error) {
//         console.error('Error sending request:', error.message);
//     }
// }





// async function sendTransactionRequest(name, table, body) {
//     try {
//         console.log("sending tx");
//         console.log("TX BODY:", JSON.stringify(body, null, 2));

//         const response = await axios.post(
//             `${config.transactionApiUrl}/sendTransaction`,
//             body,
//             {
//                 headers: { "Content-Type": "application/json" },
//                 httpsAgent: agent
//             }
//         );

//         count();
//         const transactionSentTime = new Date().toISOString();
//         console.log("Request sent successfully:", response.data);

//         // fetch transaction hash
//         const txHash = await getTransactionHash({ queueId: response.data.queueId });

//         const tableName = table;

//         // check if txHash already exists
//         const selectQuery = `SELECT * FROM ${tableName} WHERE transaction_hash = $1`;
//         const selectResponse = await pool.query(selectQuery, [txHash]);

//         if (selectResponse.rowCount) {
//             logger.info(`Entry inside ${tableName} already exists for ${txHash}`);

//             const timeTaken =
//                 new Date(selectResponse.rows[0].event_received_time) -
//                 new Date(transactionSentTime);

//             const updateQuery = `
//                 UPDATE ${tableName}
//                 SET queue_id = $1,
//                     transaction_sent_time = $2,
//                     time_taken_ms = $3
//                 WHERE transaction_hash = $4
//             `;

//             const updateResponse = await pool.query(updateQuery, [
//                 response.data.queueId,
//                 transactionSentTime,
//                 timeTaken,
//                 txHash
//             ]);

//             if (!updateResponse.rowCount) {
//                 logger.error(`Failed to update record for ${txHash}`);
//             } else {
//                 logger.info(`Record updated for ${txHash}`);
//             }
            
//         }

//         const insertQuery = `
//             INSERT INTO ${tableName}
//             (queue_id, transaction_hash, transaction_sent_time)
//             VALUES ($1, $2, NOW())
//         `;

//         const dbResponse = await pool.query(insertQuery, [
//             response.data.queueId,
//             txHash
//         ]);

//         if (!dbResponse.rowCount) {
//             logger.error(`Failed to insert record for ${txHash}`);
//         } else {
//             logger.info(`Record inserted for ${txHash}`);
//         }

//         logger.info(`tx sent ${txHash} for ${name}`);

//     } catch (error) {
//         if (error.response) {
//             console.error("❌ API Error");
//             console.error("Status:", error.response.status);
//             console.error("Data:", JSON.stringify(error.response.data, null, 2));
//         } else if (error.request) {
//             console.error("❌ No response received");
//             console.error(error.request);
//         } else {
//             console.error("❌ Request setup error:", error.message);
//         }
//     }
// }




