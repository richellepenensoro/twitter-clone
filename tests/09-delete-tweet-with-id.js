const { Pool } = require('pg');
const config = require('../config');
const { query } = require('../utils');

const exercisesDirectory = config.get('EXERCISES_DIRECTORY');
const databaseConfig = require(`../${exercisesDirectory}/01-database-connection.json`);

suite('09-delete-tweet-with-id', function() {
    const dropTweetsTableQuery = 'DROP TABLE IF EXISTS tweets;';

    setup(async function() {
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
        }, {
            body: 'third tweet',
            user_email: 'thirduser@email.com'
        }];

        for (let tweetData of this.tweetsToInsert) {
            const insertTweetQuery = await query('07-insert-tweet.sql', tweetData);
            await this.pool.query(insertTweetQuery);
        }
    });

    teardown(async function() {
        await this.pool.query(dropTweetsTableQuery);
        await this.pool.end();
    });

    test('deletes the intended tweet properly', async function() {
        const deleteTweetWithIdQuery = await query('09-delete-tweet-with-id.sql', { id: 1 });
        await this.pool.query(deleteTweetWithIdQuery);

        const getTweetQuery = `
            SELECT * FROM tweets WHERE id = 1;
        `;
        const tweets = await this.pool.query(getTweetQuery);

        if (tweets.rows.length > 0) {
            throw new Error('query did not delete the intended tweet via its id');
        }
    });

    test('does not delete any other tweets', async function() {
        const deleteTweetWithIdQuery = await query('09-delete-tweet-with-id.sql', { id: 2 });
        await this.pool.query(deleteTweetWithIdQuery);

        const getRemainingTweetsQuery = `
            SELECT * FROM tweets WHERE id = 1 OR id = 3;
        `;
        const tweets = await this.pool.query(getRemainingTweetsQuery);

        if (tweets.rows.length !== 2) {
            throw new Error('query should not delete any other tweets');
        }
    });
});
