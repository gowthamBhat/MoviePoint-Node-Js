//Built-in Packages
const express = require('express');
const mongoose = require('mongoose');
const Fawn = require('fawn');

Fawn.init(mongoose);

//Custom modules
const { Rental, validate } = require('../models/rentalsValidate');
const { Movie } = require('../models/moviesValidate');
const { Customer } = require('../models/customerValidate');


//Router 
const router = express.Router();

//*GET
router.get('/', async (req, res) => {

    const rentals = await Rental.find().sort('-dateOut');
    // const rentalsCount = await Rental.find().countDocuments();
    // if (rentalsCount == 0) res.send("No data's added");
    res.send(rentals);
});

//*POST

router.post('/', async (req, res) => {

    try {
        const val = validate(req.body);
        if (val.error) return res.status(400).send(val.error.details[0].message);

        const customer = await Customer.findById(req.body.customerId)
        // if (!customer) throw new Error('customer not found');

        const movie = await Movie.findById(req.body.movieId);
        // if (!movie) throw new Error('Movie not found');

        if (movie.numberInStock == 0) return res.status(400).send('movie not in stock');

        let rental = new Rental({

            customer: {
                _id: customer._id,
                name: customer.name,
                isGold: customer.isGold,
                phone: customer.phone
            },
            movie: {

                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            }
        });

        // rental = await rental.save();

        // movie.numberInStock--;

        // movie.save();

        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, { $inc: { numberInStock: -1 } }).run() //? 2 PHASE COMMIT USING NPM FAWN 
        //? it can be done using 2 Phase commit of Mongodb,preffer mongo doc for more info 

        res.send(rental);


    }
    catch (err) {

        res.status(404).send("data not found. request id's may be wrong");
    }






});




module.exports = router;