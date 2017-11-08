const path = require('path');
const express = require('express');
const consolidate = require('consolidate');
const methodOverride = require('method-override');
const bodyparser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');
const winston = require('winston');
const config = require('./config');

const app = express();

app.engine('html', consolidate.nunjucks);
app.set('views', path.join(__dirname, 'views'));

app.use(methodOverride('_method', {
    methods: ['GET', 'POST']
}));
app.use(morgan('dev'));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json())
app.use(session({
    secret: config.get('SESSION_SECRET'),
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/', require('./routes'));

app.listen(config.get('PORT'),
    () => winston.info(`Server now running at port ${config.get('PORT')}`));
