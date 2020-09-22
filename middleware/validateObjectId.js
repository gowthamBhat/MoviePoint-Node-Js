const mongoose = require('mongoose');

module.exports = function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send('Invalid Id');
    next()
}

//* this middleware chck for the valid email id for every get request