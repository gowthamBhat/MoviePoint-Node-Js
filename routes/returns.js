const express = require('express');
router = express.Router();
const { Rental } = require('../models/rentalsValidate');
const { Movie } = require('../models/moviesValidate');

const auth = require('../middleware/middlewareAuth');
const moment = require('moment');
const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)


router.post('/', auth, async (req, res, next) => {
    try {

        const val = validate(req.body);

        if (val.error) return res.status(400).send(val.error.details[0].message);


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

function validate(body) {

    const schema =
    {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()

    };

    return Joi.validate(body, schema);
}


module.exports = router;