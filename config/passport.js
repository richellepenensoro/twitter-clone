const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'identifier'
}, (username, password, done) => {
    const user = {
        id: 1,
        username: 'arnellebalane',
        email: 'arnellebalane@gmail.com'
    };
    done(null, user);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = {
        id: id,
        username: 'arnellebalane',
        email: 'arnellebalane@gmail.com'
    };
    done(null, user);
});

module.exports = passport;
