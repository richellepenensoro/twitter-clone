const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./database');
const { query } = require('../utils');

passport.use(new LocalStrategy({
    usernameField: 'identifier'
}, async (idenfier, password, done) => {
    const getUserWithCredentialsQuery = await query('05-get-user-with-credentials.sql', { identifier, password });
    const users = await db.query(getUserWithCredentialsQuery);

    if (users.rows.length > 0) {
        const user = users.row[0];
        user.avatar = 'static/images/default-avatar.png';
        done(null, user);
    } else {
        done(null, new Error('User not found.'));
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
    const getUsersWithEmailQuery = await query('03-get-users-with-email.sql', { email });
    const users = await db.query(getUsersWithEmailQuery);

    if (users.rows.length > 0) {
        const user = users.rows[0];
        user.avatar = 'static/images/default-avatar.png';
        done(null, users.rows[0]);
    } else {
        done(null, new Error('User not found.'));
    }
});

module.exports = passport;
