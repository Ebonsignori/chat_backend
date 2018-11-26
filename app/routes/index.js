const router = require('express').Router();

router.use('/api', require('./api/test'));

router.use('/users', require('./users'));

module.exports = router;