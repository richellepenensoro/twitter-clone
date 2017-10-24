const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');
const config = require('./config');

const exercisesDirectory = config.get('EXERCISES_DIRECTORY');

function query(filename, context={}) {
    return new Promise((resolve, reject) => {
        const queryPath = path.join(__dirname, exercisesDirectory, filename);

        fs.readFile(queryPath, 'utf8', (err, data) => {
            if (err) {
                return reject(err);
            }
            const rendered = nunjucks.renderString(data, context);
            resolve(rendered);
        });
    });
}

exports.query = query;
