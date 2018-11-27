const logger = require("../../config/logging");
const chalk = require("chalk");
const router = require('express').Router();
const redisScan = require('redisscan');
const redis = require("../../config/redis");


// For scanning the contents of reddis and printing them to the console
router.get("/redis_scan", function (req, res) {
    logger.debug(chalk`-=-=-=-=-=--=-=-=- {green.bold Begin Redis Scan}
Each scanned item is in form: 
{magenta ${"type"}} {cyan ${"key"}} {blue ${"subkey"}} {yellow ${"length"}} {green ${"value"}}
`);
    redisScan({
        redis: redis.client,
        pattern: '*',
        keys_only: false,
        each_callback: function (type, key, subkey, length, value, cb) {
            console.log(chalk`{magenta ${type}} {cyan ${key}} {blue ${subkey}} {yellow ${length}} {green ${value}}`);
            cb();
        },
        done_callback: function (err) {
            console.log(); // Newline
            logger.debug(chalk` -=-=-=-=-=--=-=-=- {green.bold End Redis Scan}`);
            res.status(200).send("Scan complete");
        }
    });
});


module.exports = router;
