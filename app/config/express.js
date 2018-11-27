const cors = require('cors');
const chalk = require('chalk');
const logger = require('./logging');
const express = require("express");
const session = require("express-session");
const redis_store = require("connect-redis")(session);
const redis = require("./redis");
const passport = require("passport");

// Initialize Express config
module.exports = (app) => {
    // Configure and apply cors
    const cors_options = {
        origin: process.env.ALLOWED_ORIGIN,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    };
    app.use(cors(cors_options));

    // Use express session // TODO: Update secret
    if (process.env.NODE_ENV === "production") {
        app.set('trust proxy', 1); // trust first proxy
    }
    const express_session = session({
        name: 'sessionId',
        secret: process.env.COOKIE_SECRET,
        /* set up your cookie how you want */
        cookie: {
            secure: process.env.NODE_ENV === "production",
            httpOnly: process.env.NODE_ENV === "production",
            maxAge: 60000,
            sameSite: process.env.NODE_ENV === "production",
        },
        store: new redis_store({
            client: redis.client
        }),
        resave: false,
        saveUninitialized: true
    });

    app.use(express_session);

    // Apply passport
    app.use(passport.initialize());
    app.use(passport.session());

    // Apply parsing middleware
    app.use(express.json()); // For parsing application/json
    app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

    // Log each url in debug mode
    app.use((req, res, next) => {
        logger.debug(chalk`Route called: {magenta ${req.url}}`);
        next();
    });

    return express_session;
};

