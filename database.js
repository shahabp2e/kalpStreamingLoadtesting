const { pool } = require("./connection.js");
const logger = require("./lib/logger.js");
async function initDb(table) {
  try {
    // const pool = getPool();
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ${table} (
    queue_id TEXT,
   transaction_hash text,
   block_number INTEGER,
    transaction_sent_time TIMESTAMP DEFAULT NOW(),
    event_name TEXT,
    event_data JSONB,
    event_received_time TIMESTAMP,
    time_taken_ms INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
      );
    `);

  } catch (err) {
    console.log(err);
    logger.error("Failed to initialize DB schema", err);
    process.exit(1);
  }
}

module.exports = { initDb };