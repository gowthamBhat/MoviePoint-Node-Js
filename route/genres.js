const express = require('express');
router = express.Router();
const asyncMiddleware = require('../middleware/asyncMiddleware');
const validateObjectId = require('../middleware/validateObjectId'); //this middleware check for the valid object_id

const auth = require('../middleware/middlewareAuth');
const admin = require('../middleware/middlewareAdmin');
const winston = require('winston');

const mongoose = require('mongoose');

const { Genres, validate } = require('../models/genresValidate'); //*Single Responsibility principle, Separating validation


//*GET
router.get('/', async (req, res, next) => {
    try {
        const genres = await Genres.find().sort('name');

        res.send(genres);
    }
    catch (er) {
        next(er);    //*error handling middleware used
    }
});

router.get('/:id', validateObjectId, asyncMiddleware(async (req, res) => {  //? asyncMiddleware is added to dynamically gen try catch block
    const gen = await Genres.findById(req.params.id);     //? for only this route async middleware is added bcz i already wrote error handling code for all other routes
    res.send(gen);                                        //? and changing them now is hectic, so im letting it be
}));



//*POST
router.post('/', auth, async (req, res) => {    //*in routers the second parameter can be a middleware

    try {
        const val = validate(req.body);

        if (val.error) return res.status(400).send(val.error.details[0].message);


        let genre = new Genres({ name: req.body.name });

        genre = await genre.save()

        // let genre = await Genres.create({
        //     name: req.body.name
        // });
        res.send(genre);

    }
    catch (err) {
        winston.error(err.message, err); //error will be shown in logfile.log
        res.status(500).send("Due to some internal issue POST method cant be performed");
    }
});



//*PUT
router.put('/:id', auth, async (req, res) => {

    try {
        const val = validate(req.body);
        if (val.error) return res.status(400).send(val.error.details[0].message)


        // const genFind = await Genres.findById(req.params.id);
        // if (!genFind) return res.status(404).send('data not found');

        //! here it's best to use promises rather using async functions,bcz i coudn't print specific error methods here
        //! it's throwing an exception whenever it's not found specific data in database, so conditonal statement doesn't work properly
        //! so i coudn't print specific messages to that exceptions
        const gen = await Genres.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });

        // const gen = await Genres.updateOne({ _id: req.params.id }, { name: req.body.name });

        res.send(gen);
    }
    catch (ex) {
        winston.error(ex.message, ex);
        res.status(404).send('data not found');
    }

});

//*DELETE
router.delete('/:id', [auth, admin], async (req, res) => {

    try {
        const gen = await Genres.findByIdAndRemove(req.params.id);

        res.send(gen);

    }
    catch (error) {
        winston.error(error.message, error);
        res.status(404).send('data not found');

    }
});

module.exports = router;
