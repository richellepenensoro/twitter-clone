function flash(req, res, next) {
    req.flash = function(key, value) {
        if (!req.session.flash) {
            req.session.flash = {};
        }
        req.session.flash[key] = value;
    };

    if (req.session.flash) {
        res.locals.flash = req.session.flash;
        delete req.session.flash;
    }

    next();
}

exports.flash = flash;
