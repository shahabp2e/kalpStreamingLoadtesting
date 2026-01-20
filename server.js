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


app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(session({ secret: "Secret_Key", resave: false, saveUninitialized: true }));
app.use(bodyParser.text());


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


const insertIntoDb = async (
    tableName,
    transactionId,
    blockNumber,
    eventName,
    eventData,
    eventReceivedTime
) => {
    try {
        const selectQuery = `
            SELECT transaction_sent_time
            FROM ${tableName}
            WHERE transaction_hash = $1
        `;
        const selectResponse = await pool.query(selectQuery, [transactionId]);

        if (!selectResponse.rowCount) {
            try {
                // Try safe insert (works if UNIQUE constraint exists)
                const insertQuery = `
                    INSERT INTO ${tableName}
                    (transaction_hash, block_number, event_name, event_data, event_received_time)
                    VALUES ($1, $2, $3, $4, $5)
                    ON CONFLICT (transaction_hash) DO NOTHING
                `;

                const res = await pool.query(insertQuery, [
                    transactionId,
                    blockNumber,
                    eventName,
                    eventData,
                    eventReceivedTime
                ]);

                if (res.rowCount === 0) {
                    logger.info(`Duplicate ignored for ${transactionId}`);
                } else {
                    logger.info(`Inserted record for ${transactionId}`);
                }
            } catch (err) {
                //  Fallback if UNIQUE constraint does NOT exist
                if (
                    err.message.includes(
                        "no unique or exclusion constraint"
                    )
                ) {
                    logger.warn(
                        `UNIQUE constraint missing, falling back insert for ${transactionId}`
                    );

                    const fallbackInsert = `
                        INSERT INTO ${tableName}
                        (transaction_hash, block_number, event_name, event_data, event_received_time)
                        VALUES ($1, $2, $3, $4, $5)
                    `;

                    await pool.query(fallbackInsert, [
                        transactionId,
                        blockNumber,
                        eventName,
                        eventData,
                        eventReceivedTime
                    ]);

                    logger.info(`Inserted record (fallback) for ${transactionId}`);
                } else {
                    throw err;
                }
            }
            return;
        }

      
        const data = selectResponse.rows[0];

        let timeTaken = null;
        if (data.transaction_sent_time) {
            timeTaken =
                new Date(eventReceivedTime) -
                new Date(data.transaction_sent_time);
        }

        const updateQuery = `
            UPDATE ${tableName}
            SET
                block_number = $1,
                event_name = $2,
                event_data = $3,
                event_received_time = $4,
                time_taken_ms = $5
            WHERE transaction_hash = $6
        `;

        const updateRes = await pool.query(updateQuery, [
            blockNumber,
            eventName,
            eventData,
            eventReceivedTime,
            timeTaken,
            transactionId
        ]);

        if (updateRes.rowCount === 0) {
            logger.error(`Failed to update record for ${transactionId}`);
        } else {
            logger.info(`Updated record for ${transactionId}`);
        }
    } catch (error) {
        logger.error(
            `Error inserting/updating DB for ${transactionId}: ${error.message}`
        );
    }
};


const handleDagRuns = async (req, res) => {
    try {
        if (!req.body || !req.body.conf) {
            return res.status(400).send("Invalid payload");
        }

        const { conf } = req.body;

        logger.info(JSON.stringify(req.body));

        const filePath = path.join(__dirname, `event_data_${CHAIN}.log`);
        fs.appendFileSync(filePath, `${conf.event_data}\n`, "utf8");

        await insertIntoDb(
            TABLE_NAME,
            conf.transaction_id,
            conf.block_number,
            conf.event_name,
            conf.event_data,
            new Date().toISOString()
        );

        res.send("Received Event!");
    } catch (error) {
        logger.error(`Webhook error: ${error.message}`);
        res.status(500).send("Internal Server Error");
    }
};


app.post("/kalpService/dagRuns", handleDagRuns);
app.post("/kalpService/devnet/dagRuns", handleDagRuns);
app.post("/kalpService/loadnet/dagRuns", handleDagRuns);


const txBody = {
    functionSignature: FUNCTION_SIGNATURE,
    args: [],
    rpcUrl: RPC_URL,
    contractAddress: CONTRACT_ADDRESS,
    backendWallet: BACKEND_WALLET,
    chainId: parseInt(CHAIN_ID)
};


app.listen(SERVICE_PORT, async () => {
    logger.info(`${SERVICE_NAME} running on port ${SERVICE_PORT}`);
    await initDb(TABLE_NAME);

    runPeriodicRequest(
        CHAIN,
        TABLE_NAME,
        txBody,
        parseInt(TIME_INTERVAL_MS || 2000)
    );
});


















































// require("dotenv").config();
// const express = require("express");
// const app = express();
// const cors = require("cors");
// const fs = require("fs");
// const path = require("path");
// const session = require("express-session");
// const bodyParser = require("body-parser");
// const logger = require("./lib/logger.js");
// const { runPeriodicRequest } = require("./controller/apiRequestContract.js");
// const { initDb } = require("./database.js");
// const { pool } = require("./connection.js");
// const { Agent, setGlobalDispatcher } = require("undici");

// const agent = new Agent({ connect: { rejectUnauthorized: false } });
// setGlobalDispatcher(agent);

// app.use(express.json({ limit: '50mb' }));
// app.use(cors());
// app.use(session({ secret: "Secret_Key" }));
// app.use(bodyParser.text());

// // === Load Config from ENV ===
// const {
//     SERVICE_NAME,
//     SERVICE_PORT,
//     TABLE_NAME,
//     CHAIN,
//     FUNCTION_SIGNATURE,
//     CONTRACT_ADDRESS,
//     BACKEND_WALLET,
//     RPC_URL,
//     CHAIN_ID,
//     TIME_INTERVAL_MS
// } = process.env;

// // === Helper: Insert into DB ===
// const insertIntoDb = async (tableName, transactionId, blockNumber, eventName, eventData, eventReceivedTime) => {
//     try {
//         const selectQuery = `select * from ${tableName} where transaction_hash=$1`;
//         const selectResponse = await pool.query(selectQuery, [transactionId]);

//         if (!selectResponse.rowCount) {
//             logger.info(`Entry inside ${tableName} does not exist`);
//             // update the database with the txhash and eventName and eventData and eventReceivedTime
//             const insertQuery = `INSERT INTO ${tableName} (transaction_hash,block_number, event_name, event_data, event_received_time) VALUES ($1, $2, $3, $4,$5)`;
//             const dbResponse = await pool.query(insertQuery, [transactionId, blockNumber, eventName, eventData, eventReceivedTime]);
//             if (dbResponse.rowCount == 0) {
//                 logger.error(`Failed to insert record for ${transactionId}`);
//             } else {
//                 logger.info(`Record inserted for ${transactionId}`);
//             }
//             return;
//         }

//         const data = selectResponse.rows[0];
//         const timeTaken = new Date(eventReceivedTime) - new Date(data.transaction_sent_time);
//         const updateQuery = `UPDATE ${tableName} SET block_number=$1,event_name=$2, event_data=$3, event_received_time=$4, time_taken_ms=$5 WHERE transaction_hash=$6`;
//         const dbResponse = await pool.query(updateQuery, [blockNumber, eventName, eventData, eventReceivedTime, timeTaken, transactionId]);
//         if (dbResponse.rowCount == 0) {
//             logger.error(`Failed to insert record for ${transactionId}`);
//         } else {
//             logger.info(`Record inserted for ${transactionId}`);
//         }
//     } catch (error) {
//         console.log(error)
//         logger.error(`Error inserting into DB for ${transactionId}: ${error.message}`);
//     }
// };

// // === Webhook Endpoint ===
// app.post("/kalpService/dagRuns", (req, res) => {
//     console.log("===================")
//     console.log(req.body.conf.event_data);
//     const data = req.body.conf.event_data;
//     logger.info(JSON.stringify(req.body));
//     const conf = req.body.conf;
//     const filePath = path.join(__dirname, `event_data_${CHAIN}.log`);
//     fs.appendFileSync(filePath, data + "\n", "utf8");
//     const time = new Date().toISOString();

//     insertIntoDb(TABLE_NAME, conf.transaction_id, conf.block_number, conf.event_name, conf.event_data, new Date().toISOString());
//     res.send("Received Event!");
// });
// app.post("/kalpService/devnet/dagRuns", (req, res) => {
//     console.log("===================")
//     console.log(req.body.conf.event_data);
//     const data = req.body.conf.event_data;
//     logger.info(JSON.stringify(req.body));
//     const conf = req.body.conf;
//     const filePath = path.join(__dirname, `event_data_${CHAIN}.log`);
//     fs.appendFileSync(filePath, data + "\n", "utf8");
//     const time = new Date().toISOString();

//     insertIntoDb(TABLE_NAME, conf.transaction_id, conf.block_number, conf.event_name, conf.event_data, new Date().toISOString());
//     res.send("Received Event!");
// });


// app.post("/kalpService/loadnet/dagRuns", (req, res) => {
//     console.log("===================")
//     console.log(req.body.conf.event_data);
//     const data = req.body.conf.event_data;
//     logger.info(JSON.stringify(req.body));
//     const conf = req.body.conf;
//     const filePath = path.join(__dirname, `event_data_${CHAIN}.log`);
//     fs.appendFileSync(filePath, data + "\n", "utf8");
//     const time = new Date().toISOString();

//     insertIntoDb(TABLE_NAME, conf.transaction_id, conf.block_number, conf.event_name, conf.event_data, new Date().toISOString());
//     res.send("Received Event!");
// });

// // === Transaction Body ===
// const txBody = {
//     functionSignature: FUNCTION_SIGNATURE,
//     args: [],
//     rpcUrl: RPC_URL,
//     contractAddress: CONTRACT_ADDRESS,
//     backendWallet: BACKEND_WALLET,
//     chainId: parseInt(CHAIN_ID)
// };

// // === Start Server ===
// app.listen(SERVICE_PORT, async () => {
//     logger.info(`${SERVICE_NAME} running on port ${SERVICE_PORT}`);
//     await initDb(TABLE_NAME);
//     runPeriodicRequest(CHAIN, TABLE_NAME, txBody, parseInt(TIME_INTERVAL_MS || 2000));
// });











// require("dotenv").config();
// const express = require("express");
// const app = express();
// const cors = require("cors");
// const fs = require("fs");
// const path = require("path");
// const session = require("express-session");
// const bodyParser = require("body-parser");
// const logger = require("./lib/logger.js");
// const { runPeriodicRequest } = require("./controller/apiRequestContract.js");
// const { initDb } = require("./database.js");
// const { pool } = require("./connection.js");
// const { Agent, setGlobalDispatcher } = require("undici");

// /**
//  * =====================================================
//  * Global HTTP Agent
//  * =====================================================
//  */
// const agent = new Agent({ connect: { rejectUnauthorized: false } });
// setGlobalDispatcher(agent);

// /**
//  * =====================================================
//  * Middleware
//  * =====================================================
//  */
// app.use(express.json({ limit: "50mb" }));
// app.use(cors());
// app.use(session({ secret: "Secret_Key", resave: false, saveUninitialized: true }));
// app.use(bodyParser.text());

// /**
//  * =====================================================
//  * ENV Config
//  * =====================================================
//  */
// const {
//     SERVICE_NAME,
//     SERVICE_PORT,
//     TABLE_NAME,
//     CHAIN,
//     FUNCTION_SIGNATURE,
//     CONTRACT_ADDRESS,
//     BACKEND_WALLET,
//     RPC_URL,
//     CHAIN_ID,
//     TIME_INTERVAL_MS
// } = process.env;

// /**
//  * =====================================================
//  * DB Helper (FIXED)
//  * =====================================================
//  */
// const insertIntoDb = async (
//     tableName,
//     transactionId,
//     blockNumber,
//     eventName,
//     eventData,
//     eventReceivedTime
// ) => {
//     try {
//         const selectQuery = `
//             SELECT transaction_sent_time
//             FROM ${tableName}
//             WHERE transaction_hash = $1
//         `;
//         const selectResponse = await pool.query(selectQuery, [transactionId]);

//         /**
//          * -------------------------------------------------
//          * INSERT (SAFE FROM DUPLICATES)
//          * -------------------------------------------------
//          */
//         if (!selectResponse.rowCount) {
//             const insertQuery = `
//                 INSERT INTO ${tableName}
//                 (transaction_hash, block_number, event_name, event_data, event_received_time)
//                 VALUES ($1, $2, $3, $4, $5)
//                 ON CONFLICT (transaction_hash) DO NOTHING
//             `;

//             const dbResponse = await pool.query(insertQuery, [
//                 transactionId,
//                 blockNumber,
//                 eventName,
//                 eventData,
//                 eventReceivedTime
//             ]);

//             if (dbResponse.rowCount === 0) {
//                 logger.info(`Duplicate ignored for ${transactionId}`);
//             } else {
//                 logger.info(`Inserted record for ${transactionId}`);
//             }
//             return;
//         }

//         /**
//          * -------------------------------------------------
//          * UPDATE (SAFE time_taken calculation)
//          * -------------------------------------------------
//          */
//         const data = selectResponse.rows[0];

//         let timeTaken = null;
//         if (data.transaction_sent_time) {
//             timeTaken =
//                 new Date(eventReceivedTime) -
//                 new Date(data.transaction_sent_time);
//         }

//         const updateQuery = `
//             UPDATE ${tableName}
//             SET
//                 block_number = $1,
//                 event_name = $2,
//                 event_data = $3,
//                 event_received_time = $4,
//                 time_taken_ms = $5
//             WHERE transaction_hash = $6
//         `;

//         const dbResponse = await pool.query(updateQuery, [
//             blockNumber,
//             eventName,
//             eventData,
//             eventReceivedTime,
//             timeTaken,
//             transactionId
//         ]);

//         if (dbResponse.rowCount === 0) {
//             logger.error(`Failed to update record for ${transactionId}`);
//         } else {
//             logger.info(`Updated record for ${transactionId}`);
//         }
//     } catch (error) {
//         logger.error(
//             `Error inserting/updating DB for ${transactionId}: ${error.message}`
//         );
//     }
// };

// /**
//  * =====================================================
//  * Shared Webhook Handler
//  * =====================================================
//  */
// const handleDagRuns = async (req, res) => {
//     try {
//         if (!req.body || !req.body.conf) {
//             return res.status(400).send("Invalid payload");
//         }

//         const { conf } = req.body;

//         logger.info(JSON.stringify(req.body));

//         const filePath = path.join(__dirname, `event_data_${CHAIN}.log`);
//         fs.appendFileSync(filePath, `${conf.event_data}\n`, "utf8");

//         await insertIntoDb(
//             TABLE_NAME,
//             conf.transaction_id,
//             conf.block_number,
//             conf.event_name,
//             conf.event_data,
//             new Date().toISOString()
//         );

//         res.send("Received Event!");
//     } catch (error) {
//         logger.error(`Webhook error: ${error.message}`);
//         res.status(500).send("Internal Server Error");
//     }
// };

// /**
//  * =====================================================
//  * Webhook Routes
//  * =====================================================
//  */
// app.post("/kalpService/dagRuns", handleDagRuns);
// app.post("/kalpService/devnet/dagRuns", handleDagRuns);
// app.post("/kalpService/loadnet/dagRuns", handleDagRuns);

// /**
//  * =====================================================
//  * Transaction Body
//  * =====================================================
//  */
// const txBody = {
//     functionSignature: FUNCTION_SIGNATURE,
//     args: [],
//     rpcUrl: RPC_URL,
//     contractAddress: CONTRACT_ADDRESS,
//     backendWallet: BACKEND_WALLET,
//     chainId: parseInt(CHAIN_ID)
// };

// /**
//  * =====================================================
//  * Start Server
//  * =====================================================
//  */
// app.listen(SERVICE_PORT, async () => {
//     logger.info(`${SERVICE_NAME} running on port ${SERVICE_PORT}`);
//     await initDb(TABLE_NAME);

//     runPeriodicRequest(
//         CHAIN,
//         TABLE_NAME,
//         txBody,
//         parseInt(TIME_INTERVAL_MS || 2000)
//     );
// });
