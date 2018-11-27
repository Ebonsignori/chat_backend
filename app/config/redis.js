const redis = require('redis');
const { promisify } = require('util');
const logger = require("./logging");
const client = redis.createClient(process.env.REDIS_URL);

client.on("error", function (err) {
    logger.error("Error in redis:" + err);
});

module.exports = {
    client: client,
    get: promisify(client.get).bind(client),
    set: promisify(client.set).bind(client)
};

// TEMP
/* Redis example:

let res;
    try {
        res = await redis.set("test", "A test string!");
    } catch (err) {
        console.log("Failed to set redis key!");
        console.log(err);
    }
    if (res === "OK") {
        const res2 = await redis.get("test");
        console.log(res2);
    } else {
        console.log("Failed to set redis key!");
    }


 */