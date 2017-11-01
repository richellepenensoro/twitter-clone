-- Get the user that have the specifed credentials.
--
-- You have access to the following variables which can be used as placeholders
-- for actual values:
--     - identifier  (could be email or username)
--     - password
--
-- Using variables (note that these are not SQL variables, they are only used
-- in order for this exercise to work properly):
--
--     given  : password = 'arnellebalane@gmail.com'
--     query  : SOME AWESOME QUERY password = '{{password}}';
--     result : SOME AWESOME QUERY password = 'arnellebalane@gmail.com';
--
-- Write your query below:
SELECT (email, username) AS identifier, password
FROM users
WHERE (email = '{{identifier}}' OR username = '{{identifier}}') AND password = '{{password}}';
