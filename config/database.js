const { Pool } = require('pg');
const config = require('./index');
const { query } = require('../utils');

const exercisesDirectory = config.get('EXERCISES_DIRECTORY');
const databaseConfig = require(`../${exercisesDirectory}/01-database-connection.json`);

const pool = new Pool(databaseConfig.development);

// Run prerequisite queries on app startup.
const queries = [
    '02-create-users-table.sql',
    '06-create-tweets-table.sql',
    '10-create-follows-table.sql'
];

(async () => {
    for (let filename of queries) {
        await pool.query(await query(filename));
    }
})();

module.exports = pool;
