const { Pool } = require('pg');
const database_management = require('./database_management');

let pool;

module.exports = {
    initialize_database: async () => {
        const connection_params = {
            user: process.env.POSTGRES_USER,
            host: process.env.DATABASE_URL,
            database: process.env.POSTGRES_DB,
            password: process.env.POSTGRES_PASSWORD,
            port: 5432,
        };

        // If database doesn't exist, create it and populate it will tables
        try {
            pool = new Pool(connection_params);
        } catch (e) {
            await database_management.createDatabase();
            pool = new Pool(connection_params);
            await this.createTables();
        }

        pool.on('connect', () => {
            console.log('Connected to the db');
        });
    },

    query: async (text, params) => {
        if (!pool) {
            throw "Call initialize_database first";
        }
        const results = await pool.query(text, params).catch((err) => {
            if (err) {
                throw err;
            }
        });
        console.log('Executed query: %s :: Query Rows: %s', text, results ? results.rowCount : undefined);
        return results;
    },

    /**
     * Create Tables
     */
    createTables: async () => {
        if (!pool) {
            throw "Call initialize_database first";
        }
        const queryText =
            `CREATE TABLE IF NOT EXISTS
         messages(
           id SERIAL PRIMARY KEY,
           contents text,
           created_date TIMESTAMP NOT NULL
         )`;

        await pool.query(queryText)
            .then((res) => {
                console.log(res);
                pool.end();
            })
            .catch((err) => {
                console.log(err);
                pool.end();
            });
        console.log("messages table created.");
    },

    /**
     * Drop Tables
     */
    dropTables: async () => {
        if (!pool) {
            throw "Call initialize_database first";
        }
        const queryText = 'DROP TABLE IF EXISTS reflections';
        await pool.query(queryText)
            .then((res) => {
                console.log(res);
                pool.end();
            })
            .catch((err) => {
                console.log(err);
                pool.end();
            });
    }
};