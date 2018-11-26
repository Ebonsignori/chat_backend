const queries = require("../db/queries");
const db  = require("../db");
const chalk = require("chalk");
const router = require('express').Router();
const logger = require("../config/logging");
const passport = require("passport");
const bcrypt = require('bcryptjs');
const salt_rounds = 12;

router.post("/register", async function registerNewUser(req, res) {
    // TODO Validate fields

    logger.info(chalk`A new user with account_name: {green ${req.body.account_name}} just registered`);

    const password_hash = await bcrypt.hash(req.body.password, salt_rounds);
    let insert_user_result = await db.query(queries.users.create_user, [
        req.body.account_name,
        req.body.first_name,
        req.body.last_name,
        req.body.email,
        password_hash,
        new Date(),
    ]).catch((err) => {
        logger.error("Error in new user insert");
        logger.error(err);
    });

    logger.silly("Insert new user results:");
    logger.silly(insert_user_result);

    if (!insert_user_result || insert_user_result.rows.length < 1) {
        logger.error("User was not inserted");
        res.send("User was not inserted");
        return;
    }

    res.send(`User ${req.body.account_name} created!`).json({account_name: req.body.account_name});
});

router.post("/login",
    function(req, res, next) {
        // TODO: Validate that uname and password were passed and match standards
        // Populate username and password before passing it on to Passport.
        req.query.username = req.body.account_name;
        req.query.password = req.body.password;
        next();
    }, passport.authenticate('local', function(err, user, info) {

    }),
    async function login(req, res) {
        // res.status(200).send(`User ${req.body.account_name} logged in.`).json(req.user);
        res.json(req.user);
});

module.exports = router;