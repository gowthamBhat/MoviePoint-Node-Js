const express = require('express');
const mongoose = require('mongoose');

const { Movie, validate } = require('../models/moviesValidate');
const { Genres } = require('../models/genresValidate');
const auth = require('../middleware/middlewareAuth');

router = express.Router();

//*GET
router.get('/', async (req, res) => {

    try {
        const movie = await Movie.find().sort('name');
        res.send(movie);
    }
    catch (err) {
        res.status(400).send('operation failed');
    }
});

router.get('/:id', async (req, res) => {
    try {

        const movies = await Movie.findById(req.params.id);

        res.send(movies);
    }
    catch (err) {

        res.status(404).send('data not found');
    }

});


//*POST

router.post('/',auth , async (req, res) => {

    try {
        const val = validate(req.body);

        if (val.error) return res.status(400).send(val.error.details[0].message);

        const genre = await Genres.findById(req.body.genreId);

        if (!genre) return res.status(404).send('genre not found');

        const movies = new Movie({

            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        })

        const result = await movies.save();


        res.send(result);

    }
    catch (err) {
        res.status(400).send("Due to some internal issue POST method cant be performed");
    }
});



//*PUT
router.put('/:id', async (req, res) => {

    try {
        const val = validate(req.body);
        if (val.error) return res.status(400).send(val.error.details[0].message);

        // const genFind = await Genres.findById(req.params.id);
        // if (!genFind) return res.status(404).send('data not found');

        const genre = await Genres.findById(req.body.genreId);

        if (!genre) return res.status(404).send('genre not found');



        const gen = await Movie.findByIdAndUpdate(req.params.id, {

            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate



        }, { new: true });

        // const gen = await Genres.updateOne({ _id: req.params.id }, { name: req.body.name });


        res.send(gen);
    }
    catch (ex) {
        res.status(404).send('data not found');

    }
});

//*DELETE
router.delete('/:id', async (req, res) => {

    try {
        const gen = await Movie.findByIdAndRemove(req.params.id);

        res.send(gen);

    }
    catch (error) {
        res.status(404).send('data not found');

    }
});





module.exports = router;