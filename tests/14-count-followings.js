const { Pool } = require('pg');
const config = require('../config');
const { query } = require('../utils');

const exercisesDirectory = config.get('EXERCISES_DIRECTORY');
const databaseConfig = require(`../${exercisesDirectory}/01-database-connection.json`);

suite('14-count-followings', function() {
    const dropTablesQuery = `
        DROP TABLE IF EXISTS follows;
        DROP TABLE IF EXISTS users;`;

    suiteSetup(async function() {
        this.pool = new Pool(databaseConfig.test);
        await this.pool.query(dropTablesQuery);

        const createUsersTableQuery = await query('02-create-users-table.sql');
        const createFollowsTableQuery = await query('10-create-follows-table.sql');
        await this.pool.query(createUsersTableQuery);
        await this.pool.query(createFollowsTableQuery);

        const usersToInsert = [{
            fullname: 'User One',
            username: 'userone',
            email: 'userone@email.com',
            password: 'passwordone'
        }, {
            fullname: 'User Two',
            username: 'usertwo',
            email: 'usertwo@email.com',
            password: 'passwordtwo'
        }, {
            fullname: 'User Three',
            username: 'userthree',
            email: 'userthree@email.com',
            password: 'passwordthree'
        }];
        const followsToInsert = [
            { following: 'userone@email.com', follower: 'usertwo@email.com' },
            { following: 'userone@email.com', follower: 'userthree@email.com' },
            { following: 'userthree@email.com', follower: 'userone@email.com' },
            { following: 'userthree@email.com', follower: 'usertwo@email.com' }
        ];

        for (let userData of usersToInsert) {
            const insertUserQuery = await query('04-insert-user.sql', userData);
            await this.pool.query(insertUserQuery);
        }
        for (let followData of followsToInsert) {
            const followUserQuery = await query('11-follow-user.sql', followData);
            await this.pool.query(followUserQuery);
        }
    });

    suiteTeardown(async function() {
        await this.pool.query(dropTablesQuery);
        await this.pool.end();
    });

    test('returns correct followings count', async function() {
        const testCases = [
            ['userone@email.com', 1],
            ['usertwo@email.com', 2],
            ['userthree@email.com', 1]
        ];

        for (let [email, count] of testCases) {
            const countFollowingsQuery = await query('14-count-followings.sql', { email });
            const result = await this.pool.query(countFollowingsQuery);
            const followingsCount = parseInt(result.rows[0].count, 10);

            if (followingsCount !== count) {
                throw new Error('query returned an incorrect followings count');
            }
        }
    });
});
