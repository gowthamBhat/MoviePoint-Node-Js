const Joi = require('joi');
const mongoose = require('mongoose');

//*JOI VALIDATE FUNCTION
function validate(genre) {
    const schema = {
        name: Joi.string().min(3).required(),
        isGold: Joi.bool(),
        phone: Joi.string().min(3).required()
    };
    return Joi.validate(genre, schema);
}

//*MONGOOSE SCHEMA
const customerSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
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
});

const Customer = mongoose.model('Customer', customerSchema);

exports.Customer = Customer;
exports.validate = validate;
