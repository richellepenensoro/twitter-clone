-- Create a table named "follows" with the following columns:
--     id           (integer)       primary key, auto increment
--     following    (string)        the email of the person being followed,
--                                  should be a foreign key to the "users" table
--     follower     (string)        the email of the person that follows,
--                                  should be a foreign key to the "users" table
--     created_at   (timestamp)     default to current timestamp
--
-- Write your query below:
DROP TABLE IF EXISTS follows;

CREATE TABLE follows(
  id SERIAL PRIMARY KEY,
  following VARCHAR(30) NOT NULL,
  follower VARCHAR(30) NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  FOREIGN KEY(following) REFERENCES users(email),
  FOREIGN KEY(follower) REFERENCES users(email)
);
