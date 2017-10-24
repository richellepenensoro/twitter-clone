const router = new require('express').Router();
const passport = require('./config/passport');

router.get('/', (req, res) => {
    res.locals.user = req.user;

    if (req.user) {
        res.render('feed.html');
    } else {
        res.render('landing.html');
    }
});

router.post('/login',
    passport.authenticate('local', { failureRedirect: '/' }),

    (req, res) => {
        if (req.body.remember) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // expire in 30 days
        } else {
            req.session.cookie.expires = false; // expire at the end of session
        }
        res.redirect('/');
    }
);

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
