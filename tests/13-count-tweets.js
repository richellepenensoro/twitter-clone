const { Pool } = require('pg');
const config = require('../config');
const { query } = require('../utils');

const exercisesDirectory = config.get('EXERCISES_DIRECTORY');
const databaseConfig = require(`../${exercisesDirectory}/01-database-connection.json`);

suite('13-count-tweets', function() {
    const dropTweetsTableQuery = 'DROP TABLE IF EXISTS tweets;';

    suiteSetup(async function() {
        this.pool = new Pool(databaseConfig.test);
        await this.pool.query(dropTweetsTableQuery);

        const createTweetsTableQuery = await query('06-create-tweets-table.sql');
        await this.pool.query(createTweetsTableQuery);

        const tweetsToInsert = [{
            body: 'first tweet',
            user_email: 'firstuser@email.com'
        }, {
            body: 'second tweet',
            user_email: 'seconduser@email.com'
        }, {
            body: 'third tweet',
            user_email: 'firstuser@email.com'
        }];

        for (let tweetData of tweetsToInsert) {
            const insertTweetQuery = await query('07-insert-tweet.sql', tweetData);
            await this.pool.query(insertTweetQuery);
        }
    });

    suiteTeardown(async function() {
        await this.pool.query(dropTweetsTableQuery);
        await this.pool.end();
    });

    test('returns correct tweets count', async function() {
        const testCases = [
            ['firstuser@email.com', 2],
            ['seconduser@email.com', 1]
        ];

        for (const [email, count] of testCases) {
            const countTweetsQuery = await query('13-count-tweets.sql', { email });
            const result = await this.pool.query(countTweetsQuery);
            const tweetsCount = parseInt(result.rows[0].count, 10);

            if (tweetsCount !== count) {
                throw new Error('query returned an incorrect tweets count');
            }
        }
    });
});
