-- Get follow suggestions for a given user. Suggestions should be those other
-- users that the given user does not follow yet.
--
-- You have access to the following variables which can be used as placeholders
-- for actual values:
--     - email
--
-- Write your query below:
SELECT email
FROM users
WHERE email = ALL(
  SELECT following
  FROM follows
  WHERE NOT follower = '{{email}}'
);
