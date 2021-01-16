const Joi = require('joi');
const mongoose = require('mongoose');



const rentalsSchema = new mongoose.Schema({

    customer: {

        type: new mongoose.Schema({


            name: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 50,
                trim: true
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            }
        }),

        required: true
    },

    movie: {

        type: new mongoose.Schema({

            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 3,
                maxlength: 255
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                minlength: 0,
                maxlength: 255
            }

        }),

        required: true

    },

    dateOut: {
        type: Date,
        required: true,
        default: Date.now

    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

const Rental = mongoose.model('Rental', rentalsSchema);

function validate(request) {

    const Schema = {

        customerId: Joi.string().required(),
        movieId: Joi.string().required()

    }
    return Joi.validate(request, Schema);

}

exports.Rental = Rental;
exports.validate = validate;

