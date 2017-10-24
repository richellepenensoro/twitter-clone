const { Pool } = require('pg');
const config = require('../config');
const { query } = require('../utils');

const exercisesDirectory = config.get('EXERCISES_DIRECTORY');
const databaseConfig = require(`../${exercisesDirectory}/01-database-connection.json`);

suite('02-create-users-table', function() {
    const dropUsersTableQuery = 'DROP TABLE IF EXISTS users;';

    suiteSetup(async function() {
        const databaseConnection = databaseConfig.test;
        this.pool = new Pool(databaseConnection);
        await this.pool.query(dropUsersTableQuery);

        const sql = await query('02-create-users-table.sql');
        await this.pool.query(sql);
    });

    suiteTeardown(async function() {
        await this.pool.query(dropUsersTableQuery);
        await this.pool.end();
    });

    test('creates "users" table successfully', async function() {
        const getUsersTableQuery = `
            SELECT * FROM information_schema.tables
            WHERE table_name = 'users';
        `;
        const tables = await this.pool.query(getUsersTableQuery);

        if (tables.rows.length === 0) {
            throw new Error('users table was not created');
        }
    });

    test('creates "users" table only if it does not exist yet', async function() {
        const sql = await query('02-create-users-table.sql');
        await this.pool.query(sql);
    });

    test('creates "fullname" column properly', async function() {
        const getFullnameColumnQuery = `
            SELECT * FROM information_schema.columns
            WHERE table_name = 'users'
                AND column_name = 'fullname';
        `;
        const columns = await this.pool.query(getFullnameColumnQuery);
        const fullnameColumn = columns.rows[0];

        if (!fullnameColumn) {
            throw new Error('the "fullname" column was not created');
        } else if (fullnameColumn.data_type !== 'character varying') {
            throw new Error('the "fullname" column should be of type VARCHAR');
        } else if (fullnameColumn.is_nullable !== 'NO') {
            throw new Error('the "fullname" column should not be nullable');
        }
    });

    test('creates "username" column properly', async function() {
        const getUsernameColumnQuery = `
            SELECT * FROM information_schema.columns
            WHERE table_name = 'users'
                AND column_name = 'username';
        `;
        const columns = await this.pool.query(getUsernameColumnQuery);
        const usernameColumn = columns.rows[0];

        if (!usernameColumn) {
            throw new Error('the "username" column was not created');
        } else if (usernameColumn.data_type !== 'character varying') {
            throw new Error('the "username" column should be of type VARCHAR');
        } else if (usernameColumn.character_maximum_length !== 15) {
            throw new Error('the "username" column should have a maximum length of 15 characters');
        } else if (usernameColumn.is_nullable !== 'NO') {
            throw new Error('the "username" column should not be nullable');
        }

        const getUsernameConstraintQuery = `
            SELECT * FROM information_schema.table_constraints
            WHERE constraint_name = 'users_username_key'
                AND constraint_type = 'UNIQUE';
        `;
        const constraints = await this.pool.query(getUsernameConstraintQuery);

        if (constraints.rows.length === 0) {
            throw new Error('the "username" column should be unique');
        }
    });

    test('creates "email" column properly', async function() {
        const getEmailColumnQuery = `
            SELECT * FROM information_schema.columns
            WHERE table_name = 'users'
                AND column_name = 'email';
        `;
        const columns = await this.pool.query(getEmailColumnQuery);
        const emailColumn = columns.rows[0];

        if (!emailColumn) {
            throw new Error('the "email" column was not created');
        } else if (emailColumn.data_type !== 'character varying') {
            throw new Error('the "email" column should be of type VARCHAR');
        } else if (emailColumn.is_nullable !== 'NO') {
            throw new Error('the "email" column should not be nullable');
        }

        const getEmailConstraintQuery = `
            SELECT * FROM information_schema.table_constraints
            WHERE constraint_name = 'users_pkey'
                AND constraint_type = 'PRIMARY KEY';
        `;
        const constraints = await this.pool.query(getEmailConstraintQuery);

        if (constraints.rows.length === 0) {
            throw new Error('the "email" column should be the primary key');
        }
    });

    test('creates "created_at" column properly', async function() {
        const getCreatedAtColumnQuery = `
            SELECT * FROM information_schema.columns
            WHERE table_name = 'users'
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
