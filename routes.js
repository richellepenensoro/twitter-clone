const router = new require('express').Router();

router.get('/', (req, res) => {
    res.render('landing.html');
});

module.exports = router;
