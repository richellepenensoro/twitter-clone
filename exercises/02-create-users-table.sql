-- Create a table named "users" with the following columns:
--     fullname     (string)
--     username     (string)        unique, max length = 15
--     email        (string)        primary key
--     password     (string)
--     created_at   (timestamp)     default to current timestamp
--
-- Write your query below:
DROP TABLE IF EXISTS users;

CREATE TABLE users(
  fullname VARCHAR(30) NOT NULL,
  username VARCHAR(15) UNIQUE NOT NULL,
  email VARCHAR(30) PRIMARY KEY NOT NULL,
  password VARCHAR(30) NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
