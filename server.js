require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const logger = require("./lib/logger.js");
const { runPeriodicRequest } = require("./controller/apiRequestContract.js");
const { initDb } = require("./database.js");
const { pool } = require("./connection.js");
const { Agent, setGlobalDispatcher } = require("undici");

const agent = new Agent({ connect: { rejectUnauthorized: false } });
setGlobalDispatcher(agent);

app.use(express.json({ limit: '50mb' }));
app.use(cors());
app.use(session({ secret: "Secret_Key" }));
app.use(bodyParser.text());

// === Load Config from ENV ===
const {
    SERVICE_NAME,
    SERVICE_PORT,
    TABLE_NAME,
    CHAIN,
    FUNCTION_SIGNATURE,
    CONTRACT_ADDRESS,
    BACKEND_WALLET,
    RPC_URL,
    CHAIN_ID,
    TIME_INTERVAL_MS
} = process.env;

// === Helper: Insert into DB ===
const insertIntoDb = async (tableName, transactionId, blockNumber, eventName, eventData, eventReceivedTime) => {
    try {
        const selectQuery = `select * from ${tableName} where transaction_hash=$1`;
        const selectResponse = await pool.query(selectQuery, [transactionId]);

        if (!selectResponse.rowCount) {
            logger.info(`Entry inside ${tableName} does not exist`);
            // update the database with the txhash and eventName and eventData and eventReceivedTime
            const insertQuery = `INSERT INTO ${tableName} (transaction_hash,block_number, event_name, event_data, event_received_time) VALUES ($1, $2, $3, $4,$5)`;
            const dbResponse = await pool.query(insertQuery, [transactionId, blockNumber, eventName, eventData, eventReceivedTime]);
            if (dbResponse.rowCount == 0) {
                logger.error(`Failed to insert record for ${transactionId}`);
            } else {
                logger.info(`Record inserted for ${transactionId}`);
            }
            return;
        }

        const data = selectResponse.rows[0];
        const timeTaken = new Date(eventReceivedTime) - new Date(data.transaction_sent_time);
        const updateQuery = `UPDATE ${tableName} SET block_number=$1,event_name=$2, event_data=$3, event_received_time=$4, time_taken_ms=$5 WHERE transaction_hash=$6`;
        const dbResponse = await pool.query(updateQuery, [blockNumber, eventName, eventData, eventReceivedTime, timeTaken, transactionId]);
        if (dbResponse.rowCount == 0) {
            logger.error(`Failed to insert record for ${transactionId}`);
        } else {
            logger.info(`Record inserted for ${transactionId}`);
        }
    } catch (error) {
        console.log(error)
        logger.error(`Error inserting into DB for ${transactionId}: ${error.message}`);
    }
};

// === Webhook Endpoint ===
app.post("/amoy/dagRuns", (req, res) => {
    console.log(req.body.conf.event_data);
    const data = req.body.conf.event_data;
    logger.info(JSON.stringify(req.body));
    const conf = req.body.conf;
    const filePath = path.join(__dirname, `event_data_${CHAIN}.log`);
    fs.appendFileSync(filePath, data + "\n", "utf8");
    const time = new Date().toISOString();

    insertIntoDb(TABLE_NAME, conf.transaction_id, conf.block_number, conf.event_name, conf.event_data, new Date().toISOString());
    res.send("Received Event!");
});

// === Transaction Body ===
const txBody = {
    functionSignature: FUNCTION_SIGNATURE,
    args: [],
    rpcUrl: RPC_URL,
    contractAddress: CONTRACT_ADDRESS,
    backendWallet: BACKEND_WALLET,
    chainId: parseInt(CHAIN_ID)
};

// === Start Server ===
app.listen(SERVICE_PORT, async () => {
    logger.info(`${SERVICE_NAME} running on port ${SERVICE_PORT}`);
    await initDb(TABLE_NAME);
    runPeriodicRequest(CHAIN, TABLE_NAME, txBody, parseInt(TIME_INTERVAL_MS || 2000));
});
