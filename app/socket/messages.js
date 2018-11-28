const logger = require("../config/logging");
const queries = require("../db/queries");
const db = require("../db/index");
const redis = require("../config/redis");

async function sendAllMessages(socket) {
    // Send all previous messages from database to users on initial connect
    let messages_result = await db.query(queries.messages.fetch_messages).catch((err) => {
        logger.error("Error in fetching all messages");
        logger.error(err);
    });
    socket.emit("existing_messages", messages_result ? messages_result.rows : []);
}

async function listenForNewMessages(socket) {
    socket.on("new_message", onMessage);

    async function onMessage(payload) {
        logger.silly(`Received Message: ${payload.message}`);

        // If user is logged in with a session
        if (socket.handshake.session && socket.handshake.session.passport && socket.handshake.session.passport.user) {
            // Insert message into database
            let insert_message_result = await db.query(queries.messages.insert_message, [payload.message, new Date()]).catch((err) => {
                logger.error("Error in message insert");
                logger.error(err);
            });

            // Send message to all users
            socket.emit("new_message", insert_message_result.rows[0]);
        } else {
            socket.emit("user_not_logged_in", false);
        }

        // * DEPRECATED Method: Manually send session ID in socket message and fetch session from Redis store
        // /* Parse cookie containing user sessionID and call Redis using sessionID to see if user's session is active
        //  The first 14 characters of the cookie session id will always be the same
        //  The Redis key is prefixed with "sess: "
        //  */
        // const first_period = payload.cookie.indexOf('.', 14);
        // payload.cookie = "sess:" + payload.cookie.substr(14, first_period - 14);
        // const passport_user = JSON.parse(await redis.get(payload.cookie)).passport;
        //
        // if (passport_user && passport_user.user) {
    }
}

module.exports = {
    sendAllMessages: sendAllMessages,
    listenForNewMessages: listenForNewMessages
};