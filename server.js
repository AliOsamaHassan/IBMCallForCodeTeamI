'use strict';

//Modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // eslint-disable-line no-use-before-define

//Routes declarations
const ROUTERS = require('./routes/routesHandlers');

const app = express();

//View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Path for static files
app.use(express.static(path.join(__dirname, 'public')));

//Parser for Requests
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//Routes
app.use('/', ROUTERS);

//Catch 404 and forward error to handler
app.use((request, response, next) => {
    let error = new Error('Not Found');
    error.status = 404;
    next(error);
});

//Error Handler
app.use((error, request, response, next) => { // eslint-disable-line
    response.status(error.status || 500);
    response.render('error', {
        status: error.status,
        message: error.message
    });
});

app.listen(3000, function () {
    console.log('Survival Network Listening to PORT 3000'); // eslint-disable-line
});

module.exports = app;