const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy((username, password, done) => {
    const user = {
        username: 'arnellebalane',
        email: 'arnellebalane@gmail.com'
    };
    done(null, user);
}));
