const Joi = require('joi');
const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },

    password: {

        type: String,
        required: true,
        min: 6,
        max: 255
    }

});
