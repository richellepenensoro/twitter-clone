const router = new require('express').Router();
const passport = require('./config/passport');

router.get('/', (req, res) => {
    console.log(req.user);
    res.render('landing.html');
});

router.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/',
        successRedirect: '/'
    })
);

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
