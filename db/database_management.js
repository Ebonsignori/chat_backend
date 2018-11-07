const pgtools = require('pgtools');

const config = {
    user: process.env.POSTGRES_USER,
    host: process.env.DATABASE_URL,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
};

async function createDatabase() {
    await pgtools.createdb(config, process.env.POSTGRES_DB).catch((err, res) => {
        if (err) {
            console.log("Failed to create database: '%s'. Exiting", process.env.POSTGRES_DB);
            console.error(err);
            process.exit(-1);
        }
        console.log("Database: '%s' created.", process.env.POSTGRES_DB);
        console.log(res);
    });
}

async function dropDatabase() {
    await pgtools.dropdb(config, process.env.POSTGRES_DB).catch((err, res) => {
        if (err) {
            console.log("Failed to drop database: '%s'. Exiting", process.env.POSTGRES_DB);
            console.error(err);
            process.exit(-1);
        }
        console.log(res);
        console.log("Database: '%s' dropped.", process.env.POSTGRES_DB);
    });
}

module.exports = {
    createDatabase: createDatabase,
    dropDatabase: dropDatabase
};

