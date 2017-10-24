const assert = require('assert');
const { Pool } = require('pg');
const config = require('../config');
const { query } = require('../utils');

const exercisesDirectory = config.get('EXERCISES_DIRECTORY');
const databaseConfig = require(`../${exercisesDirectory}/01-database-connection.json`);

suite('02-create-users-table', function() {
    beforeEach(function() {
        const databaseConnection = databaseConfig.test;
        this.pool = new Pool(databaseConnection);
        return this.pool.query('DROP TABLE IF EXISTS users;');
    });

    afterEach(function() {
        return this.pool.query('DROP TABLE IF EXISTS users;')
            .then(() => this.pool.end());
    });

    test('creates users table successfully', function() {
        return query('02-create-users-table.sql').then(sql => {
            return this.pool.query(sql).then(() => {
                const getTableQuery = `
                    SELECT *
                    FROM information_schema.tables
                    WHERE table_name = 'users'
                `;
                return this.pool.query(getTableQuery).then(results => {
                    return results.rows.length === 1
                        ? Promise.resolve()
                        : Promise.reject('users table does not exist');
                });
            });
        });
    });
});
