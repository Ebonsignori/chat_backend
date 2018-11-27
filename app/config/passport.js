const Strategy = require('passport-local').Strategy;
const queries = require("../db/queries");
const db  = require("../db");
const chalk = require("chalk");
const logger = require("../config/logging");
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
    // Configure the local strategy for use by Passport.
    //
    // The local strategy require a `verify` function which receives the credentials
    // (`username` and `password`) submitted by the user.  The function must verify
    // that the password is correct and then invoke `cb` with a user object, which
    // will be set at `req.user` in route handlers after authentication.
    passport.use(new Strategy(
        async function(username, password, done_cb) {
            const results = await db.query(queries.users.fetch_user_by_account_name, [
                username
            ]).catch((err) => {
                logger.error("Error in fetching password by username");
                logger.error(err);
                done_cb(err);
            });

            if (!results || results.rows.length < 1 || results.rows === undefined) {
                logger.silly(`Account name DNE: ${username}`);
                done_cb(null, false, "Account does not exist.");
                return;
            }

            const user_obj = results.rows[0];
            const password_matches = await bcrypt.compare(password, user_obj.password);

            if (password_matches) {
                // Remove hashed password from user object
                user_obj.password = "";
                done_cb(null, user_obj);
            } else {
                logger.warn(`Incorrect password for account_name: ${username}`);
                done_cb(null, false, "Bad password.");
            }
        }));

    // Configure Passport authenticated session persistence.
    //
    // In order to restore authentication state across HTTP requests, Passport needs
    // to serialize users into and deserialize users out of the session.  The
    // typical implementation of this is as simple as supplying the user ID when
    // serializing, and querying the user record by ID from the database when
    // deserializing.
    passport.serializeUser(function(user, cb) {
        logger.silly(chalk`Serialize User: {red ${user.account_name}} With id: {red ${user.id}}`);
        cb(null, user.id);
    });

    passport.deserializeUser(async function(id, cb) {
        logger.silly(chalk`Deserialize Id: {red ${id}}`);
        try {
            let results = await db.query(queries.users.fetch_user_by_id, [id]).catch((err) => {
                logger.error("Error fetching user by id");
                logger.error(err);
                return cb(err);
            });
            const user_obj = results.rows[0];

            // Remove password hash from user object
            user_obj.password = "";
            return cb(null, user_obj);
        } catch (err) {
            return cb(err);
        }
    });
};