const { Pool } = require('pg');
const config = require('../config');
const { query } = require('../utils');

const exercisesDirectory = config.get('EXERCISES_DIRECTORY');
const databaseConfig = require(`../${exercisesDirectory}/01-database-connection.json`);

suite('04-insert-user', function() {
    const dropTweetsTableQuery = 'DROP TABLE IF EXISTS tweets;';

    suiteSetup(async function() {
        this.pool = new Pool(databaseConfig.test);
        await this.pool.query(dropTweetsTableQuery);

        const createTweetsTableQuery = await query('06-create-tweets-table.sql');
        await this.pool.query(createTweetsTableQuery);

        this.tweetsToInsert = [{
            body: 'first tweet',
            user_email: 'firstuser@email.com'
        }, {
            body: 'second tweet',
            user_email: 'seconduser@email.com'
        }];

        for (let tweetData of this.tweetsToInsert) {
            const insertTweetQuery = await query('07-insert-tweet.sql', tweetData);
            await this.pool.query(insertTweetQuery);
        }
    });

    suiteTeardown(async function() {
        await this.pool.query(dropTweetsTableQuery);
        await this.pool.end();
    });

    test('returns all tweets', async function() {
        const getAllTweetsQuery = await query('08-get-all-tweets.sql');
        const tweets = await this.pool.query(getAllTweetsQuery);

        if (tweets.rows.length !== this.tweetsToInsert.length) {
            throw new Error('query did not return all tweets');
        }
    });

    test('returns the most recent tweets first', async function() {
        const getAllTweetsQuery = await query('08-get-all-tweets.sql');
        const tweets = await this.pool.query(getAllTweetsQuery);
        const tweetsToInsert = this.tweetsToInsert;

        for (let i = 0; i < tweets.rows.length; i++) {
            if (tweets.rows[i].body !== tweetsToInsert[tweetsToInsert.length - (1 + i)].body) {
                throw new Error('query did not return the most recent tweets first');
            }
        }
    });
});
