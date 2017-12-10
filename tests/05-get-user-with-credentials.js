const { Pool } = require('pg');
const config = require('../config');
const { query } = require('../utils');

const exercisesDirectory = config.get('EXERCISES_DIRECTORY');
const databaseConfig = require(`../${exercisesDirectory}/01-database-connection.json`);

suite('05-get-user-with-credentials', function() {
    const dropUsersTableQuery = 'DROP TABLE IF EXISTS users CASCADE;';

    suiteSetup(async function() {
        this.pool = new Pool(databaseConfig.test);
        await this.pool.query(dropUsersTableQuery);

        const sql = await query('02-create-users-table.sql');
        await this.pool.query(sql);

        const insertInitialUsersQuery = `
            INSERT INTO users VALUES
                ('First User', 'firstuser', 'firstuser@gmail.com', 'password'),
                ('Second User', 'seconduser', 'seconduser@gmail.com', 'password'),
                ('Third User', 'thirduser', 'thirduser@gmail.com', 'password');
        `;
        await this.pool.query(insertInitialUsersQuery);
    });

    suiteTeardown(async function() {
        await this.pool.query(dropUsersTableQuery);
        await this.pool.end();
    });

    test('retrieves the correct user using email and password', async function() {
        const credentialsToQuery = [
            ['firstuser@gmail.com', 'password'],
            ['seconduser@gmail.com', 'password'],
            ['thirduser@gmail.com', 'password']
        ];

        for (let [identifier, password] of credentialsToQuery) {
            const getUserWithCredentialsQuery = await query('05-get-user-with-credentials.sql', { identifier, password });
            const users = await this.pool.query(getUserWithCredentialsQuery);

            if (users.rows.length === 0) {
                throw new Error('query did not return any users');
            }

            const user = users.rows[0];
            if (user.email !== identifier) {
                throw new Error('query did not return the correct user');
            }
        }
    });

    test('retrieves the correct user using username and password', async function() {
        const credentialsToQuery = [
            ['firstuser', 'password'],
            ['seconduser', 'password'],
            ['thirduser', 'password']
        ];

        for (let [identifier, password] of credentialsToQuery) {
            const getUserWithCredentialsQuery = await query('05-get-user-with-credentials.sql', { identifier, password });
            const users = await this.pool.query(getUserWithCredentialsQuery);

            if (users.rows.length === 0) {
                throw new Error('query did not return any users');
            }

            const user = users.rows[0];
            if (user.username !== identifier) {
                throw new Error('query did not return the correct user');
            }
        }
    });

    test('retrieves nothing if user with credentials does not exist', async function() {
        const credentialsToQuery = [
            ['fourthuser@gmail.com', 'password'],
            ['fifthuser', 'password'],
            ['firstuser@gmail.com', 'wrongpassword']
        ];

        for (let [identifier, password] of credentialsToQuery) {
            const getUserWithCredentialsQuery = await query('05-get-user-with-credentials.sql', { identifier, password });
            const users = await this.pool.query(getUserWithCredentialsQuery);

            if (users.rows.length > 0) {
                throw new Error('query should not return users that don\'t exist');
            }
        }
    });
});
