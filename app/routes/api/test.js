const router = require('express').Router();

router.get("/test", function (req, res) {
    return res.send("Hello world");
});

module.exports = router;