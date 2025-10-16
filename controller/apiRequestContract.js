// fix this
const axios = require('axios');
const https = require("https");
const count = require('./count.js');
const logger = require('../lib/logger.js');
const agent = new https.Agent({
    rejectUnauthorized: false,
});
const { pool } = require("../connection.js");
// Function to send the cURL request
async function sendTransactionRequest(name, table, body) {
    try {
        console.log(`sending tx`);
        const response = await axios.post(
            'http://64.227.188.32:4000/sendTransaction',
            body,
            {
                headers: { 'Content-Type': 'application/json' },
                httpsAgent: agent
            },
        );
        count();
        const transactionSentTime = new Date().toISOString();
        console.log('Request sent successfully:', response.data);
        //fetch transaction hash
        const txHash = await getTransactionHash({ queueId: response.data.queueId });
        //store in postgres
        const tableName = table
        // check if txHash already exists inside table , if yes then 
        const selectQuery = `select * from ${tableName} where transaction_hash=$1`;
        const selectResponse = await pool.query(selectQuery, [txHash]);
        if (selectResponse.rowCount) {
            logger.info(`Entry inside ${tableName} already exists for ${txHash}`);
            // update the queueId, transaction_sent_time, time_Taken_ms
            const timeTaken = new Date(selectResponse.rows[0].event_received_time) - new Date(transactionSentTime);
            const updateQuery = `UPDATE ${tableName} SET queue_id=$1, transaction_sent_time=$2,time_taken_ms=$3 WHERE transaction_hash=$4`;
            const updateResponse = await pool.query(updateQuery, [response.data.queueId, transactionSentTime, timeTaken, txHash]);
            if (updateResponse.rowCount == 0) {
                logger.error(`Failed to update record for ${txHash} with queue_id ${response.data.queueId}`);
            } else {
                logger.info(`Record updated for ${txHash} with queue_id ${response.data.queueId}`);
            }
            return;
        }
        const insertQuery = `INSERT INTO ${tableName} (queue_id, transaction_hash,transaction_sent_time) VALUES ($1, $2,NOW()) `;
        const dbResponse = await pool.query(insertQuery, [response.data.queueId, txHash]);
        if (dbResponse.rowCount == 0) {
            logger.error(`Failed to insert record for ${txHash} with queue_id ${response.data.queueId}`);
        } else {
            logger.info(`Record inserted for ${txHash} with queue_id ${response.data.queueId}`);
        }
        logger.info(`tx sent ${txHash} for ${name}`);
    } catch (error) {
        console.error('Error sending request:', error.message);
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

async function getTransactionHash({ queueId, maxAttempts = 10, delayMs = 3000 }) {
    if (!queueId) {
        throw new Error("Missing required parameters for getTransactionHash");
    }
    const writeUrl = `http://64.227.188.32:4000/transactionStatus/${queueId}`;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const response = await fetch(writeUrl, {
                method: "GET",
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            if (result?.txHash) {
                return result.txHash;
            }
            if (attempt < maxAttempts) {
                await new Promise((resolve) => setTimeout(resolve, delayMs));
            } else {
                throw new Error("Transaction hash not available after maximum retries.");
            }
        } catch (error) {
            if (attempt === maxAttempts) {
                throw new Error("Failed to fetch transaction hash after multiple attempts.");
            }
            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
    }
}
module.exports = { runPeriodicRequest };