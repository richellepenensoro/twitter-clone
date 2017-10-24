const assert = require('assert');
const { Pool } = require('pg');
const config = require('../config');
const { query } = require('../utils');

const exercisesDirectory = config.get('EXERCISES_DIRECTORY');
const databaseConfig = require(`../${exercisesDirectory}/01-database-connection.json`);

suite('02-create-users-table', function() {
    const dropUsersTableQuery = 'DROP TABLE IF EXISTS users;';

    setup(async function() {
        const databaseConnection = databaseConfig.test;
        this.pool = new Pool(databaseConnection);
        await this.pool.query(dropUsersTableQuery);
    });

    teardown(async function() {
        await this.pool.query(dropUsersTableQuery);
        await this.pool.end();
    });

    test('creates users table successfully', async function() {
        const sql = await query('02-create-users-table.sql');
        await this.pool.query(sql);

        const getUsersTableQuery = `
            SELECT *
            FROM information_schema.tables
            WHERE table_name = 'users';
        `;
        const result = await this.pool.query(getUsersTableQuery);

        if (result.rows.length === 0) {
            throw new Error('"users" table does not exist');
        }
    });
});
