const { Pool } = require('pg');
const config = require('../config');
const { query } = require('../utils');

const exercisesDirectory = config.get('EXERCISES_DIRECTORY');
const databaseConfig = require(`../${exercisesDirectory}/01-database-connection.json`);

suite('10-create-follows-table', function() {
    const dropUsersTableQuery = 'DROP TABLE IF EXISTS users;'
    const dropFollowsTableQuery = 'DROP TABLE IF EXISTS follows;';

    suiteSetup(async function() {
        this.pool = new Pool(databaseConfig.test);
        await this.pool.query(dropFollowsTableQuery);

        const createUsersTableQuery = await query('02-create-users-table.sql');
        const createFollowsTableQuery = await query('10-create-follows-table.sql');
        await this.pool.query(createUsersTableQuery);
        await this.pool.query(createFollowsTableQuery);
    });

    suiteTeardown(async function() {
        await this.pool.query(dropFollowsTableQuery);
        await this.pool.query(dropUsersTableQuery);
        await this.pool.end();
    });

    test('creates "follows" table successfully', async function() {
        const getTweetsTableQuery = `
            SELECT * FROM information_schema.tables
            WHERE table_name = 'follows';
        `;
        const tables = await this.pool.query(getTweetsTableQuery);

        if (tables.rows.length === 0) {
            throw new Error('follows table was not created');
        }
    });

    test('creates "follows" table only if it does not exist yet', async function() {
        const createFollowsTableQuery = await query('10-create-follows-table.sql');
        await this.pool.query(createFollowsTableQuery);
    });

    test('creates "id" column properly', async function() {
        const getIdColumnQuery = `
            SELECT * FROM information_schema.columns
            WHERE table_name = 'follows'
                AND column_name = 'id';
        `;
        const columns = await this.pool.query(getIdColumnQuery);
        const idColumn = columns.rows[0];

        if (!idColumn) {
            throw new Error('the "id" column was not created');
        } else if (idColumn.data_type !== 'integer') {
            throw new Error('the "id" column should be an integer');
        } else if (idColumn.is_nullable !== 'NO') {
            throw new Error('the "id" column should dnot be nullable');
        }

        const getIdConstraintQuery = `
            SELECT * FROM information_schema.table_constraints
            WHERE constraint_name = 'follows_pkey'
                AND constraint_type = 'PRIMARY KEY';
        `;
        const constraints = await this.pool.query(getIdConstraintQuery);

        if (constraints.rows.length === 0) {
            throw new Error('the "id" column should be the primary key');
        }
    });

    test('creates "following" column properly', async function() {
        const getFollowingColumnQuery = `
            SELECT * FROM information_schema.columns
            WHERE table_name = 'follows'
                AND column_name = 'following';
        `;
        const columns = await this.pool.query(getFollowingColumnQuery);
        const followingColumn = columns.rows[0];

        if (!followingColumn) {
            throw new Error('the "following" column was not created');
        } else if (followingColumn.data_type !== 'character varying') {
            throw new Error('the "following" column should be of type VARCHAR');
        } else if (followingColumn.is_nullable !== 'NO') {
            throw new Error('the "following" column should not be nullable');
        }

        const getFollowingConstraintQuery = `
            SELECT * FROM information_schema.table_constraints
            WHERE constraint_name = 'follows_following_fkey'
                AND constraint_type = 'FOREIGN KEY';
        `;
        const constraints = await this.pool.query(getFollowingConstraintQuery);

        if (constraints.rows.length === 0) {
            throw new Error('the "following" column should reference the "email" column in the "users" table');
        }
    });

    test('creates "follower" column properly', async function() {
        const getFollowerColumnQuery = `
            SELECT * FROM information_schema.columns
            WHERE table_name = 'follows'
                AND column_name = 'follower';
        `;
        const columns = await this.pool.query(getFollowerColumnQuery);
        const followerColumn = columns.rows[0];

        if (!followerColumn) {
            throw new Error('the "follower" column was not created');
        } else if (followerColumn.data_type !== 'character varying') {
            throw new Error('the "follower" column should be of type VARCHAR');
        } else if (followerColumn.is_nullable !== 'NO') {
            throw new Error('the "follower" column should not be nullable');
        }

        const getFollowerConstraintQuery = `
            SELECT * FROM information_schema.table_constraints
            WHERE constraint_name = 'follows_follower_fkey'
                AND constraint_type = 'FOREIGN KEY';
        `;
        const constraints = await this.pool.query(getFollowerConstraintQuery);

        if (constraints.rows.length === 0) {
            throw new Error('the "follower" column should reference the "email" column in the "users" table');
        }
    });

    test('creates "created_at" column properly', async function() {
        const getCreatedAtColumnQuery = `
            SELECT * FROM information_schema.columns
            WHERE table_name = 'follows'
                AND column_name = 'created_at';
        `;
        const columns = await this.pool.query(getCreatedAtColumnQuery);
        const createdAtColumn = columns.rows[0];

        if (!createdAtColumn) {
            throw new Error('the "created_at" column was not created');
        } else if (createdAtColumn.data_type.indexOf('timestamp') < 0) {
            throw new Error('the "created_at" column should be a timestamp');
        } else if (createdAtColumn.column_default !== 'now()') {
            throw new Error('the "created_at" column should default to the current timestamp');
        }
    });
});
