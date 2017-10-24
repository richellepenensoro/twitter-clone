# Twitter Clone

Lab exercise for CMSC127 class.

## Instructions

1. Install at least the latest version of [Node.js](https://nodejs.org/en/), which is **8.7** at the time of writing.

2. Install at least the latest version of [PostgreSQL](https://www.postgresql.org/), which is **9.6** at the time of writing.

3. Install project dependencies:

   ```shell
   $ npm install
   ```

4. You can find the exercises that you need to do inside the `exercises` directory. Each file in that directory contains instructions for that specific task.

5. Create your `development` and `test` databases. The `development` database is going to be used by the actual application itself, while the `test` database will be used for running test suites. After creating these databases, save their connection information to `exercises/01-database-connection.json`.

6. This project includes test cases to verify the correctness of your SQL queries. The tests can be run by executing the following command in your terminal:

   ```shell
   $ npm test
   ```

7. Once you've made all the tests pass, you can now run the application by executing the following command in your terminal:

   ```shell
   $ npm start
   ```

   The SQL queries that you wrote are the exact same queries used by the application. You can view the application by visiting `localhost:3000` in your Web browser.
