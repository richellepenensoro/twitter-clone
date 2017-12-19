const { Pool } = require('pg');
const config = require('../config');
const { query } = require('../utils');

const exercisesDirectory = config.get('EXERCISES_DIRECTORY');
const databaseConfig = require(`../${exercisesDirectory}/01-database-connection.json`);

suite('16-get-follow-suggestions', function() {
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
        }, {
            fullname: 'User Four',
            username: 'userfour',
            email: 'userfour@email.com',
            password: 'passwordfour'
        }, {
            fullname: 'User Five',
            username: 'userfive',
            email: 'userfive@email.com',
            password: 'passwordfive'
        }];
        const followsToInsert = [
            { following: 'userone@email.com', follower: 'usertwo@email.com' },
            { following: 'userone@email.com', follower: 'userthree@email.com' },
            { following: 'userthree@email.com', follower: 'userone@email.com' },
            { following: 'userthree@email.com', follower: 'usertwo@email.com' },
            { following: 'userfour@email.com', follower: 'userone@email.com' },
            { following: 'userfive@email.com', follower: 'userthree@email.com' }
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

    test('returns users that are not followed yet', async function() {
        const testCases = [
            ['userone@email.com', ['usertwo@email.com', 'userfive@email.com']],
            ['usertwo@email.com', ['userfour@email.com', 'userfive@email.com']],
            ['userthree@email.com', ['usertwo@email.com', 'userfour@email.com']],
            ['userfour@email.com', ['userone@email.com', 'usertwo@email.com', 'userthree@email.com', 'userfive@email.com']],
            ['userfive@email.com', ['userone@email.com', 'usertwo@email.com', 'userthree@email.com', 'userfour@email.com']]
        ];

        for (let [email, correct] of testCases) {
            const getFollowSuggestionsQuery = await query('16-get-follow-suggestions.sql', { email });
            const result = await this.pool.query(getFollowSuggestionsQuery);
            const suggestions = result.rows;

            for (let suggestion of suggestions) {
                if (!correct.includes(suggestion.email)) {
                    throw new Error('suggestions included a user that is already being followed');
                }
            }
        }
    });
});
