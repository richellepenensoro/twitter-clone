const { Pool } = require('pg');
const config = require('../config');
const { query } = require('../utils');

const exercisesDirectory = config.get('EXERCISES_DIRECTORY');
const databaseConfig = require(`../${exercisesDirectory}/01-database-connection.json`);

suite('04-insert-user', function() {
    const dropTweetsTableQuery = 'DROP TABLE IF EXISTS tweets;';

    setup(async function() {
        this.pool = new Pool(databaseConfig.test);
        await this.pool.query(dropTweetsTableQuery);

        const createTweetsTableQuery = await query('06-create-tweets-table.sql');
        await this.pool.query(createTweetsTableQuery);
    });

    teardown(async function() {
        await this.pool.query(dropTweetsTableQuery);
        await this.pool.end();
    });

    test('inserts the tweet successfully', async function() {
        const tweetsToInsert = [{
            body: 'first tweet',
            user_email: 'firstuser@email.com'
        }, {
            body: 'second tweet',
            user_email: 'seconduser@email.com'
        }];

        for (let tweetData of tweetsToInsert) {
            const insertTweetQuery = await query('07-insert-tweet.sql', tweetData);
            await this.pool.query(insertTweetQuery);

            const getLatestTweetQuery = `
                SELECT * FROM tweets ORDER BY id DESC LIMIT 1;
            `;
            const tweets = await this.pool.query(getLatestTweetQuery);

            if (tweets.rows.length === 0) {
                throw new Error('tweet data was not inserted');
            }

            const tweet = tweets.rows[0];
            for (let key in tweetData) {
                if (tweetData[key] !== tweet[key]) {
                    throw new Error(`tweet's "${key}" column was not inserted properly`);
                }
            }
        }
    });

    test('sets the default value for "created_at" column', async function() {
        const tweetData = {
            body: 'first tweet',
            user_email: 'firstuser@gmail.com'
        };
        const insertTweetQuery = await query('07-insert-tweet.sql', tweetData);
        await this.pool.query(insertTweetQuery);

        const getLatestTweetQuery = `
            SELECT * FROM tweets ORDER BY id DESC LIMIT 1;
        `;
        const tweets = await this.pool.query(getLatestTweetQuery);
        const tweet = tweets.rows[0];

        if (!Boolean(tweet.created_at)) {
            throw new Error('user\'s "created_at" column was not inserted properly');
        }
    });

    test('auto-increments the tweet "id" column', async function() {
        const tweetsToInsert = [{
            body: 'first tweet',
            user_email: 'firstuser@email.com'
        }, {
            body: 'second tweet',
            user_email: 'seconduser@email.com'
        }];
        let lastTweetId = 0;

        for (let tweetData of tweetsToInsert) {
            const insertTweetQuery = await query('07-insert-tweet.sql', tweetData);
            await this.pool.query(insertTweetQuery);

            const getLatestTweetQuery = `
                SELECT * FROM tweets ORDER BY id DESC LIMIT 1;
            `;
            const tweets = await this.pool.query(getLatestTweetQuery);
            const tweet = tweets.rows[0];

            if (tweet.id - lastTweetId !== 1) {
                throw new Error('tweet\'s "id" key should be auto-incremented');
            }
            lastTweetId = tweet.id;
        }
    });
});
