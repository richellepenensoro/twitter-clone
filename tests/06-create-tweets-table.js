const { Pool } = require('pg');
const config = require('../config');
const { query } = require('../utils');

const exercisesDirectory = config.get('EXERCISES_DIRECTORY');
const databaseConfig = require(`../${exercisesDirectory}/01-database-connection.json`);

suite('06-create-tweets-table', function() {
    const dropTweetsTableQuery = 'DROP TABLE IF EXISTS tweets';

    suiteSetup(async function() {
        this.pool = new Pool(databaseConfig.test);
        await this.pool.query(dropTweetsTableQuery);

        const createTweetsTableQuery = await query('06-create-tweets-table.sql');
        await this.pool.query(createTweetsTableQuery);
    });

    suiteTeardown(async function() {
        await this.pool.query(dropTweetsTableQuery);
        await this.pool.end();
    });

    test('creates "tweets" table successfully', async function() {
        const getTweetsTableQuery = `
            SELECT * FROM information_schema.tables
            WHERE table_name = 'tweets';
        `;
        const tables = await this.pool.query(getTweetsTableQuery);

        if (tables.rows.length === 0) {
            throw new Error('tweets table was not created');
        }
    });

    test('creates "tweets" table only if it does not exist yet', async function() {
        const createTweetsTableQuery = await query('06-create-tweets-table.sql');
        await this.pool.query(createTweetsTableQuery);
    });

    test('creates "id" column properly', async function() {
        const getIdColumnQuery = `
            SELECT * FROM information_schema.columns
            WHERE table_name = 'tweets'
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
            WHERE constraint_name = 'tweets_pkey'
                AND constraint_type = 'PRIMARY KEY';
        `;
        const constraints = await this.pool.query(getIdConstraintQuery);

        if (constraints.rows.length === 0) {
            throw new Error('the "id" column should be the primary key');
        }
    });

    test('creates "body" column properly', async function() {
        const getBodyColumnQuery = `
            SELECT * FROM information_schema.columns
            WHERE table_name = 'tweets'
                AND column_name = 'body';
        `;
        const columns = await this.pool.query(getBodyColumnQuery);
        const bodyColumn = columns.rows[0];

        if (!bodyColumn) {
            throw new Error('the "body" column was not created');
        } else if (bodyColumn.data_type !== 'character varying') {
            throw new Error('the "body" column should be of type VARCHAR');
        } else if (bodyColumn.character_maximum_length !== 140) {
            throw new Error('the "body" column should have a maximum length of 140 characters');
        } else if (bodyColumn.is_nullable !== 'NO') {
            throw new Error('the "body" column should not be nullable');
        }
    });

    test('creates "user_email" column properly', async function() {
        const getUserEmailColumnQuery = `
            SELECT * FROM information_schema.columns
            WHERE table_name = 'tweets'
                AND column_name = 'user_email';
        `;
        const columns = await this.pool.query(getUserEmailColumnQuery);
        const userEmailColumn = columns.rows[0];

        if (!userEmailColumn) {
            throw new Error('the "user_email" column was not created');
        } else if (userEmailColumn.data_type !== 'character varying') {
            throw new Error('the "user_email" column should be of type VARCHAR');
        } else if (userEmailColumn.is_nullable !== 'NO') {
            throw new Error('the "user_email" column should not be nullable');
        }
    });

    test('creates "created_at" column properly', async function() {
        const getCreatedAtColumnQuery = `
            SELECT * FROM information_schema.columns
            WHERE table_name = 'tweets'
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
