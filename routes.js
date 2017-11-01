const router = new require('express').Router();
const passport = require('./config/passport');
const db = require('./config/database');
const { flash } = require('./middlewares');
const { query } = require('./utils');

router.use(flash);
router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

router.get('/', (req, res) => {
    if (req.user) {
        res.render('feed.html');
    } else {
        res.render('landing.html');
    }
});

router.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/',
        failureFlash: 'Invalid user credentials.'
    }),

    (req, res) => {
        if (req.body.remember) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // expire in 30 days
        } else {
            req.session.cookie.expires = false; // expire at the end of session
        }
        res.redirect('/');
    }
);

router.post('/signup', async (req, res) => {
    const getUsersWithEmailQuery = await query('03-get-users-with-email.sql', { email: req.body.email });
    const users = await db.query(getUsersWithEmailQuery);
    if (users.rows.length > 0) {
        req.flash('signupError', 'Email is already in use.');
        return res.redirect('/');
    }

    const user = {
        fullname: req.body.fullname,
        username: req.body.fullname.replace(/\s+/g, '').toLowerCase(),
        email: req.body.email,
        password: req.body.password
    };
    const insertUserQuery = await query('04-insert-user.sql', user);
    await db.query(insertUserQuery);

    req.login(user, (err) => res.redirect('/'));
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.post('/tweet', async (req, res) => {
    const createTweetQuery = await query('07-insert-tweet.sql', {
        body: req.body.tweet,
        user: req.user.email
    });
    await db.query(createTweetQuery);

    res.redirect('/');
});

module.exports = router;
