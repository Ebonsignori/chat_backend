const logger = require("../utility/logging").logger;
const tables = require("./tables");
const util = require('util');

async function createOrDropTables(pool, option) {
    logger.silly(`HANDLE_TABLES Environment variable is set to: ${process.env.HANDLE_TABLES}`);

    if (option && option === "DROP") {
        await dropTables(pool);
        logger.info("Exiting...");
        process.exit(0);
    } else if (option && option === "CREATE") {
        await createTables(pool);
        if (process.env.HANDLE_TABLES === "CREATE") {
            logger.info("Exiting...");
            process.exit(0);
        }
    }
}

/* Create Tables */
async function createTables(pool) {
    if (!pool) {
        throw "Must pass pool after calling initializeDatabase";
    }

    /* Create a table using (key, value) pairs of (table_name, table_query) from tables.js
        - table[1] = Part of the query to create the table.
        - table[0] = The name of the table */
    for await (const table of Object.entries(tables)) {
        await pool.query(`CREATE TABLE IF NOT EXISTS ${table[1]}`)
            .then((res) => {
                logger.debug(util.inspect(res, {showHidden: false, compact: false, colors: true}));
                pool.end();
            })
            .catch((err) => {
                logger.error(err);
                pool.end();
            });
            logger.info(`Table: ${table[0]} created.`);
        }
}

/* Drop Tables */
async function dropTables(pool) {
    if (!pool) {
        throw "Must pass pool after calling initializeDatabase";
    }
    const queryText = "DROP TABLE IF EXISTS reflections";
    await pool.query(queryText)
        .then((res) => {
            logger.debug(res);
            pool.end();
        })
        .catch((err) => {
            logger.error(err);
            pool.end();
        });
}

module.exports = {
    createOrDropTables: createOrDropTables,
};