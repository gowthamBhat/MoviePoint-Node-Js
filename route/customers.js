const express = require('express');
router = express.Router();

const mongoose = require('mongoose');

const { Customer, validate } = require('../models/customerValidate'); //*Single Responsibility principle, Separating validation



//*GET
router.get('/', async (req, res) => {

    const customer = await Customer.find().sort('name');

    res.send(customer);
});

router.get('/:id', async (req, res) => {

    try {
        const customer = await Customer.findById(req.params.id);

        res.send(customer);
    }
    catch (err) {
        res.status(404).send('Data not found');
    }
});


//*POST

router.post('/', async (req, res) => {

    try {
        const val = validate(req.body);

        if (val.error) return res.status(400).send(val.error.details[0].message);

        let customer = new Customer({
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
        });

        customer = await customer.save();
        res.send(customer);
    }
    catch (err) {
        res.status(400).send("Due to some internal issue POST method cant be performed");
    }
});

//*PUT

router.put('/:id', async (req, res) => {

    try {
        const val = validate(req.body);
        if (val.error) return res.status(400).send(val.error.details[0].message);

        const gen = await Customer.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });

        // const gen = await Genres.updateOne({ _id: req.params.id }, { name: req.body.name });
        res.send(gen);
    }
    catch (ex) {
        res.status(404).send('data not found');

    }
});

//*DELETE

router.delete('/:id', async (req, res) => {

    try {
        const gen = await Customer.findByIdAndRemove(req.params.id);

        res.send(gen);

    }
    catch (error) {
        res.status(404).send('data not found');

    }
});


module.exports = router;