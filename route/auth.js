const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');


const { User } = require('../models/usersValidate');

const router = express.Router();

//Joi validate method
function validate(data) {
    const schema = {
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(4).max(255)
    }
    return Joi.validate(data, schema);
}


//* POST 
router.post("/", async (req, res) => {

    try {
        const val = validate(req.body);

        if (val.error) return res.status(400).send(val.error.details[0].message);

        let user = await User.findOne({ email: req.body.email });
        if (!user) throw "invalid email or password";

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) throw "invalid email or password";

        const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));

        res.send(token);

    }
    catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;