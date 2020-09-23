const express = require('express');
router = express.Router();
const { Rental } = require('../models/rentalsValidate');
const { Movie } = require('../models/moviesValidate');

const auth = require('../middleware/middlewareAuth');
const moment = require('moment');


router.post('/', auth, async (req, res, next) => {
    try {
        if (!req.body.customerId) return res.status(400).send('Customer Id not Provided');
        if (!req.body.movieId) return res.status(400).send('Movie Id not Provided');


        const rentals = await Rental.findOne({ 'customer._id': req.body.customerId, 'movie._id': req.body.movieId });
        // console.log(rentals);
        if (!rentals) return res.status(404).send("rental not found");

        if (rentals.dateReturned) return res.status(400).send("rental allready processed");

        rentals.dateReturned = new Date();
        const rentalDays = moment().diff(rentals.dateOut, "days");



        rentals.rentalFee = rentalDays * rentals.movie.dailyRentalRate;
        await rentals.save();
        await Movie.updateOne({ _id: rentals.movie._id }, {
            $inc: { numberInStock: 1 }
        });
        res.status(200).send(rentals);
    }
    catch (er) {
        next(er);    //*error handling middleware used
    }
});

module.exports = router;