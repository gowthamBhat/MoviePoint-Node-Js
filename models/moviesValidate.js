const mongoose = require('mongoose');
const Joi = require('joi');


const { genresSchema } = require('./genresValidate');




function validate(movie) {

    const Schema = {
        title: Joi.string().required().min(3).max(255),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().min(0).max(255),
        dailyRentalRate: Joi.number().min(0).max(255)

    }
    return Joi.validate(movie, Schema)
}



const moviesSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255
    },
    genre: {
        type: genresSchema,
        required: true,
    },
    numberInStock: {
        type: Number,
        required: true,
        minlength: 0,
        maxlength: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        minlength: 0,
        maxlength: 255

    }
});

const Movie = mongoose.model('Movie', moviesSchema);

exports.Movie = Movie;
exports.validate = validate;






