//*imported Modules
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const config = require('config');
const winston = require('winston');
require('winston-mongodb');

//*CUSTOM ROUTE IMPORTED
const genres = require('./route/genres');
const customers = require('./route/customers');
const movies = require('./route/movies');
const rentals = require('./route/rentals');
const users = require('./route/users');
const auth = require('./route/auth');
const returns = require('./route/returns');
const error = require('./middleware/middlewareError');


if (!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
}

//*DATABASE CONNECTIVITY (MONGOOSE)
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(config.get('db')) //{ useNewUrlParser: true, useUnifiedTopology: true }
    .then(() => {
        console.log(`connected to ${config.get('db')}`);
        // console.log(`development env is ${process.env.NODE_ENV}`); //cross-env package is used to set node env
    })
    .catch((err) => {

        console.log("error encounterd", err);
    });
//Get-ChildItem Env: | Format-Table -Wrap -AutoSize //to see all environment variables

winston.add(new winston.transports.File({ filename: 'logfile.log' })); //* this will save log errors in logfile.log in current dir
// winston.add(new winston.transports.MongoDB({
//     db: 'mongodb://localhost:27017/moviePoint', useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false
// }));  //* this will log and save errors of database in the database with new collection

const app = express();

process.on('uncaughtException', (e) => {
    console.log("WE GOT AN UNCAUGHT EXCEPTION");
    console.log(e);
    winston.error(e.message, e);
    process.exit(1);
});
process.on('unhandledRejection', (e) => {
    console.log("WE GOT AN UNHANDLED PROMISE");
    console.log(e);
    winston.error(e.message, e);
    process.exit(1);
});

//*Middlewares
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//*CUSTOM ROUTE MIDDLEWARES
app.use('/api/genres', genres);  //? ROUTE FOR MOVIE GENRES
app.use('/api/customers', customers);//?ROUTE FOR CUSTOMERS
app.use('/api/movies', movies); //?ROUTE FOR MOVIES
app.use('/api/rentals', rentals); //? Route for RENTALS
app.use('/api/users', users); //? Route for USERS
app.use('/api/auth/', auth); //? Route for Authentication
app.use('/api/returns', returns);

app.use(error); //? Error handling middleware


//*STATIC PAGE ROUTES
app.use(express.static('public'));

// app.use(function (req, res, next) {
//     console.log('logging');
//     next();
// })


//*Route Handlers


app.get('/', (req, res) => {
    res.send('hello moviePoint');
}); //* rest of handlers are moduled and separated 



//*Port Config
const port = process.env.port || 3000;
app.listen(port, () => {
    console.log(`listing on port ${port}...`);
});

