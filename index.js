//*imported Modules
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const config = require('config');

//*CUSTOM ROUTE IMPORTED
const genres = require('./route/genres');
const customers = require('./route/customers');
const movies = require('./route/movies');
const rentals = require('./route/rentals');
const users = require('./route/users');
const auth = require('./route/auth');
const error  = require('./middleware/middlewareError');


if (!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
}

//*DATABASE CONNECTIVITY (MONGOOSE)
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect('mongodb://localhost:27017/moviePoint') //{ useNewUrlParser: true, useUnifiedTopology: true }
    .then(() => {
        console.log("connected...");
    })
    .catch((err) => {

        console.log("error encounterd", err);
    })

const app = express();


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
});



//*Port Config
const port = process.env.port || 3000;
app.listen(port, () => {
    console.log(`listing on port ${port}...`);
});

