const router = require('express').Router();

router.use('/api', require('./api/place_holder'));

router.use('/debug', isDevelopment, require('./debug/redis_scan'));

router.use('/users', require('./users'));

module.exports = router;


function isDevelopment(req, res, next) {
    if (process.env.NODE_ENV === "development") {
        return next();
    } else {
        res.status(404).send("Debug endpoints are only available during development");
    }
}