'use strict';

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const db = require('./db/index');
const table_management = require('./db/table_management');
const onSocketConnect = require("./socket/socket_listeners").onSocketConnect;
const logger = require("./utility/logging").logger;
const chalk = require("chalk");

async function main() {
    const pool = await db.initializeDatabase();

    // If environment variable HANDLE_TABLES is set on program execution, then drop or create tables depending on value
    if (process.env.HANDLE_TABLES) {
        await table_management.createOrDropTables(pool, process.env.HANDLE_TABLES);
    }

    // Start websocket server
    io.on('connection', onSocketConnect);
}

http.listen(process.env.HTTP_PORT, function(){
    logger.info(chalk`
      Backend is up and listening.
      On port: {magenta.bold ${process.env.HTTP_PORT}}.
    `);
});


main().catch((error) => {
    logger.error("FATAL: An uncaught error occurred:");
    logger.error(error);
    process.exit(0);
});