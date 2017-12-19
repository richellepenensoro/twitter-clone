const { Pool } = require('pg');
const config = require('../config');
const { query } = require('../utils');

const exercisesDirectory = config.get('EXERCISES_DIRECTORY');
const databaseConfig = require(`../${exercisesDirectory}/01-database-connection.json`);

suite('03-get-users-with-email', function() {
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

    test('retrieves the correct user successfully', async function() {
        const emailsToQuery = [
            'firstuser@gmail.com',
            'seconduser@gmail.com',
            'thirduser@gmail.com'
        ];

        for (let email of emailsToQuery) {
            const getUsersWithEmailQuery = await query('03-get-users-with-email.sql', { email });
            const users = await this.pool.query(getUsersWithEmailQuery);

            if (users.rows.length === 0) {
                throw new Error('query did not return any users');
            }

            const user = users.rows[0];
            if (user.email !== email) {
                throw new Error('query did not return the correct user');
            }
        }
    });

    test('retrieves nothing if user with email does not exist', async function() {
        const emailsToQuery = [
            'fourthuser@gmail.com',
            'fifthuser@gmail.com',
            'sixthuser@gmail.com'
        ];

        for (let email of emailsToQuery) {
            const getUsersWithEmailQuery = await query('03-get-users-with-email.sql', { email });
            const users = await this.pool.query(getUsersWithEmailQuery);

            if (users.rows.length > 0) {
                throw new Error('query should not return users that don\'t exist');
            }
        }
    });
});
