const { Pool } = require('pg');
const config = require('../config');
const { query } = require('../utils');

const exercisesDirectory = config.get('EXERCISES_DIRECTORY');
const databaseConfig = require(`../${exercisesDirectory}/01-database-connection.json`);

suite('11-follow-user', function() {
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

        for (let userData of usersToInsert) {
            const insertUserQuery = await query('04-insert-user.sql', userData);
            await this.pool.query(insertUserQuery);
        }
    });

    teardown(async function() {
        await this.pool.query(dropTablesQuery);
        await this.pool.end();
    });

    test('creates follow record properly', async function() {
        const getAllFollowsQuery = 'SELECT * FROM follows;';
        const followsToInsert = [
            { following: 'userone@email.com', follower: 'usertwo@email.com' },
            { following: 'userone@email.com', follower: 'userthree@email.com' },
            { following: 'usertwo@email.com', follower: 'userthree@email.com' }
        ];

        for (let i = 0, l = followsToInsert.length; i < l; i++) {
            const followData = followsToInsert[i];
            const followUserQuery = await query('11-follow-user.sql', followData);
            await this.pool.query(followUserQuery);

            const result = await this.pool.query(getAllFollowsQuery);
            const follows = result.rows;
            const last = follows[follows.length - 1];

            if (follows.length !== i + 1) {
                throw new Error('follow record was not added to the "follows" table');
            } else if (followData.following !== last.following || followData.follower !== last.follower) {
                throw new Error('follow record was not added properly');
            }
        }
    });

    test('sets default value for "id" column', async function() {
        const followsToInsert = [
            { following: 'userone@email.com', follower: 'usertwo@email.com' },
            { following: 'userone@email.com', follower: 'userthree@email.com' },
            { following: 'usertwo@email.com', follower: 'userthree@email.com' }
        ];

        for (let i = 0, l = followsToInsert.length; i < l; i++) {
            const followData = followsToInsert[i];
            const followUserQuery = await query('11-follow-user.sql', followData);
            await this.pool.query(followUserQuery);
        }

        const getAllFollowsQuery = 'SELECT * FROM follows;';
        const result = await this.pool.query(getAllFollowsQuery);
        const follows = result.rows;

        for (let i = 1, l = follows.length; i < l; i++) {
            if (parseInt(follows[i].id, 10) !== parseInt(follows[i - 1].id, 10) + 1) {
                throw new Error('follow\'s "id" field should be auto-incremented');
            }
        }
    });

    test('sets default value for "created_at" column', async function() {
        const followData = {
            following: 'userone@email.com',
            follower: 'usertwo@email.com'
        };
        const followUserQuery = await query('11-follow-user.sql', followData);
        await this.pool.query(followUserQuery);

        const getLatestFollowQuery = 'SELECT * FROM follows ORDER BY id DESC LIMIT 1';
        const result = await this.pool.query(getLatestFollowQuery);
        const follow = result.rows[0];

        if (!Boolean(follow.created_at)) {
            throw new Error('follow\'s "created_at" field was not inserted properly');
        }
    });
});
