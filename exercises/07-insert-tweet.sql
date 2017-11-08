-- Insert a new tweet record into the "tweets" table.
--
-- You have access to the following variables which can be used as placeholders
-- for actual values:
--     - body
--     - user_email
--
-- Using variables (note that these are not SQL variables, they are only used
-- in order for this exercise to work properly):
--
--     given  : user = 'arnellebalane@gmail.com'
--     query  : SOME AWESOME QUERY user = '{{email}}';
--     result : SOME AWESOME QUERY user = 'arnellebalane@gmail.com';
--
-- Write your query below:
INSERT INTO tweets (body, user_email) VALUES
  ('{{body}}', '{{user_email}}');
