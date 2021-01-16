const Joi = require('joi');
const mongoose = require('mongoose');

//*JOI VALIDATE FUNCTION
function validate(genre) {

    const schema =
    {
        name: Joi.string().min(3).required()

    };

    return Joi.validate(genre, schema);
}

//*Movie Genres


const genresSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        trim: true
    }

});

const Genres = mongoose.model("Genre", genresSchema);

//*EXPORT
exports.genresSchema = genresSchema;
exports.Genres = Genres;
exports.validate = validate;

