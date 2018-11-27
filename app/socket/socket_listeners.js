const messages = require("./messages");
const logger = require("../config/logging");

let socket;

async function onSocketConnect(initial_socket) {
    socket = initial_socket;
    logger.silly("User is connected to socket.");

    await messages.sendAllMessages(socket);

    // Save and broadcast consecutive (new) messages
    messages.listenForNewMessages(socket);
}

module.exports = {
    onSocketConnect: onSocketConnect
};