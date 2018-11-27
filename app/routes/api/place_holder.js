const router = require('express').Router();

router.get("/placeholder", function (req, res) {
    return res.send("This is a placeholder for the future API");
});

module.exports = router;