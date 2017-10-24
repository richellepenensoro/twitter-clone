const { Pool } = require('pg');
const config = require('../config');

const exercisesDirectory = config.get('EXERCISES_DIRECTORY');
const databaseConfig = require(`../${exercisesDirectory}/01-database-connection.json`);

suite('01-database-connection', function() {
    test('development database configured properly', async function() {
        const pool = new Pool(databaseConfig.development);
        await pool.connect();
    });

    test('test database configured properly', async function() {
        const pool = new Pool(databaseConfig.test);
        await pool.connect();
    });
});
