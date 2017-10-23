const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');
const consolidate = require('consolidate');
const morgan = require('morgan');
const winston = require('winston');
const config = require('./config');

const app = express();

app.engine('html', consolidate.nunjucks);
app.set('views', path.join(__dirname, 'views'));

app.use(morgan('dev'));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json())

app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/', require('./routes'));

app.listen(config.get('PORT'),
    () => winston.info(`Server now running at port ${config.get('PORT')}`));
