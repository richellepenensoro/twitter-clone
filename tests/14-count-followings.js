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
            { following: 1, follower: 2 },
            { following: 1, follower: 3 },
            { following: 3, follower: 1 }
        ];
    });

    suiteTeardown(async function() {
        await this.pool.query(dropTablesQuery);
        await this.pool.end();
    });

    test('returns correct followings count', async function() {

    });
});
