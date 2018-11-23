const logger = require("../utility/logging").logger;
const queries = require("../db/queries");
const db = require("../db/index");

let socket;

async function onSocketConnect(initial_socket) {
    socket = initial_socket;
    logger.silly("User is connected to socket.");

    // Send all previous messages from database to users on initial connect
    let messages_result = await db.query(queries.fetch_messages).catch((err) => {
        logger.error("Error in fetching all messages");
        logger.error(err);
    });
    socket.emit("existing_messages", messages_result ? messages_result.rows : []);

    // Save and broadcast consecutive (new) messages
    socket.on("new_message", onMessage)
}


async function onMessage(msg) {
    logger.silly(`Received Message: ${msg}`);

    // Insert message into database
    let date_received = new Date();
    let insert_message_result = await db.query(queries.insert_message, [msg, date_received]).catch((err) => {
        logger.error("Error in message insert");
        logger.error(err);
    });

    // Send message to all users
    socket.emit("new_message", insert_message_result.rows[0]);
}

module.exports = {
    onSocketConnect: onSocketConnect
};