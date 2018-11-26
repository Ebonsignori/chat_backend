const cors = require('cors');
const chalk = require('chalk');
const logger = require('./logging');
const express = require("express");
const session = require("express-session");

// Initialize Express config
module.exports = (app) => {
    // Apply cors TODO: Config cors
    app.use(cors());

    // Use express session // TODO: Update secret
    app.use(session({ secret: 'keyboard cat' }));

    // Apply parsing middleware
    app.use(express.json()); // For parsing application/json
    app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

    // Log each url in debug mode
    app.use((req, res, next) => {
        logger.debug(chalk`Route called: {magenta ${req.url}}`);
        next();
    })
};

