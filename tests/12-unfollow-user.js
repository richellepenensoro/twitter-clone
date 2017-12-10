const { Pool } = require('pg');
const config = require('../config');
const { query } = require('../utils');

const exercisesDirectory = config.get('EXERCISES_DIRECTORY');
const databaseConfig = require(`../${exercisesDirectory}/01-database-connection.json`);

suite('12-unfollow-user', function() {
    const dropTablesQuery = `
        DROP TABLE IF EXISTS follows;
        DROP TABLE IF EXISTS users;
    `;

    setup(async function() {
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
            password: 'useronepassword'
        }, {
            fullname: 'User Two',
            username: 'usertwo',
            email: 'usertwo@email.com',
            password: 'usertwopassword'
        }, {
            fullname: 'User Three',
            username: 'userthree',
            email: 'userthree@email.com',
            password: 'userthreepassword'
        }];
        const followsToInsert = [
            { following: 'userone@email.com', follower: 'usertwo@email.com' },
            { following: 'userone@email.com', follower: 'userthree@email.com' },
            { following: 'usertwo@email.com', follower: 'userthree@email.com' }
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

    teardown(async function() {
        await this.pool.query(dropTablesQuery);
        await this.pool.end();
    });

    test('deletes the intended record properly', async function() {
        const unfollowData = {
            following: 'userone@email.com',
            follower: 'usertwo@email.com'
        };
        const unfollowUserQuery = await query('12-unfollow-user.sql', unfollowData);
        await this.pool.query(unfollowUserQuery);

        const getFollowQuery = `
            SELECT * FROM follows
            WHERE following = '${unfollowData.following}'
                AND follower = '${unfollowData.follower}';`;
        const follows = await this.pool.query(getFollowQuery);

        if (follows.rows.length > 0) {
            throw new Error('query did not delete the intended follow record');
        }
    });

    test('does not delete any other tweets', async function() {
        const unfollowData = {
            following: 'userone@email.com',
            follower: 'usertwo@email.com'
        };
        const unfollowUserQuery = await query('12-unfollow-user.sql', unfollowData);
        await this.pool.query(unfollowUserQuery);

        const getAllFollowsQuery = 'SELECT * FROM follows;';
        const result = await this.pool.query(getAllFollowsQuery);

        if (result.rows.length !== 2) {
            throw new Error('query should not delete any other follow records');
        }
    });
});
