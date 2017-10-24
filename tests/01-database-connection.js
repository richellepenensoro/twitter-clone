const { Pool } = require('pg');
const config = require('../config');

const exercisesDirectory = config.get('EXERCISES_DIRECTORY');
const databaseConfig = require(`../${exercisesDirectory}/01-database-connection.json`);

suite('01-database-connection', function() {
    test('development database configured properly', async function() {
        const databaseConnection = databaseConfig.development;
        const pool = new Pool(databaseConnection);
        await pool.connect();
    });

    test('test database configured properly', async function() {
        const databaseConnection = databaseConfig.test;
        const pool = new Pool(databaseConnection);
        await pool.connect();
    });
});
