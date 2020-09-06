const Joi = require('joi');
const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        min: 3,
        max: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 255,
    },

    password: {

        type: String,
        required: true,
        min: 6,
        max: 1024
    }

});
const User = mongoose.model('User', usersSchema);



function validate(data) {
    const schema = {
        name: Joi.string().min(3).max(255).required(),
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(4).max(255)
    }
    return Joi.validate(data, schema);
}

exports.User = User;
exports.validate = validate;