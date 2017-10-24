const { Pool } = require('pg');
const config = require('../config');
const { query } = require('../utils');

const exercisesDirectory = config.get('EXERCISES_DIRECTORY');
const databaseConfig = require(`../${exercisesDirectory}/01-database-connection.json`);

suite('04-insert-user', function() {
    const dropUsersTableQuery = 'DROP TABLE IF EXISTS users;';

    suiteSetup(async function() {
        this.pool = new Pool(databaseConfig.test);
        await this.pool.query(dropUsersTableQuery);

        const sql = await query('02-create-users-table.sql');
        await this.pool.query(sql);
    });

    suiteTeardown(async function() {
        await this.pool.query(dropUsersTableQuery);
        await this.pool.end();
    });

    test('inserts the user successfully', async function() {
        const usersToInsert = [{
            fullname: 'First User',
            username: 'firstuser',
            email: 'firstuser@gmail.com',
            password: 'password'
        }, {
            fullname: 'Second User',
            username: 'seconduser',
            email: 'seconduser@gmail.com',
            password: 'password'
        }];

        for (let userData of usersToInsert) {
            const insertUserQuery = await query('04-insert-user.sql', userData);
            await this.pool.query(insertUserQuery);

            const getUsersWithEmailQuery = `
                SELECT * FROM users
                WHERE email = '${userData.email}';
            `;
            const users = await this.pool.query(getUsersWithEmailQuery);

            if (users.rows.length === 0) {
                throw new Error('user data was not inserted');
            }

            const user = users.rows[0];
            for (let key in userData) {
                if (userData[key] !== user[key]) {
                    throw new Error(`user's "${key}" column was not inserted properly`);
                }
            }
        }
    });

    test('sets default value for "created_at" column', async function() {
        const userData = {
            fullname: 'Third User',
            username: 'thirduser',
            email: 'thirduser@gmail.com',
            password: 'password'
        };
        const insertUserQuery = await query('04-insert-user.sql', userData);
        await this.pool.query(insertUserQuery);

        const getUsersWithEmailQuery = `
            SELECT * FROM users
            WHERE email = '${userData.email}';
        `;
        const users = await this.pool.query(getUsersWithEmailQuery);
        const user = users.rows[0];

        if (!Boolean(user.created_at)) {
            throw new Error('user\'s "created_at" column was not inserted properly');
        }
    });
});
