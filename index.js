const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const db = require('./db');
const queries = require("./db/queries");


async function main() {
    db.initialize_database();

    if (process.env.HANDLE_TABLES === "DROP") {
        await db.dropTables();
        console.log("Exiting...");
        process.exit(0);
    } else if (process.env.HANDLE_TABLES === "CREATE") {
        await db.createTables();
    }

    io.on('connection', async (socket) => {
        console.log('A user connected');

        // Send all previous messages from database to users on initial connect
        let messages_result = await db.query(queries.fetch_messages).catch((err) => {
            console.log("Error in fetching all messages");
            console.log(err);
        });
        socket.emit("messages", messages_result ? messages_result.rows : []);

        // Save and broadcast consecutive (new) messages
        socket.on("message", async (msg) => {
            let date_received = new Date();
            // Insert message into database
            let insert_message_result = await db.query(queries.insert_message, [msg, date_received]).catch((err) => {
                console.log("Error in message insert");
                console.log(err);
            });
            // Send message to all users
            io.emit("message", insert_message_result.rows[0]);
        })
    });
}

http.listen(3000, function(){
  console.log('listening on *:3000');
});

main();