const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

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
    },

    isAdmin:{
        type: Boolean,
        default:false
    }

});
usersSchema.methods.generateAuthToken = function(){

    const token = jwt.sign({ _id: this._id,isAdmin:this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}  //genrates auth jwt key
const User = mongoose.model('User', usersSchema);



function validate(data) {
    const schema = {
        name: Joi.string().min(3).max(255).required(),
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(4).max(255),
        isAdmin:Joi.bool()
    }
    return Joi.validate(data, schema);
}

exports.User = User;
exports.validate = validate;