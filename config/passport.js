const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'identifier'
}, (username, password, done) => {
    const user = {
        fullname: 'Arnelle Balane',
        username: 'arnellebalane',
        email: 'arnellebalane@gmail.com',
        avatar: 'static/images/default-avatar.png'
    };
    done(null, user);
}));

passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser((email, done) => {
    const user = {
        fullname: 'Arnelle Balane',
        username: 'arnellebalane',
        email: 'arnellebalane@gmail.com',
        avatar: 'static/images/default-avatar.png'
    };
    done(null, user);
});

module.exports = passport;
