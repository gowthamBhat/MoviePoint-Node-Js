const express = require('express');
router = express.Router();
const auth = require('../middleware/middlewareAuth');
const admin = require('../middleware/middlewareAdmin');


const mongoose = require('mongoose');

const { Genres, validate } = require('../models/genresValidate'); //*Single Responsibility principle, Separating validation


//*GET
router.get('/', async (req, res) => {
    try {
    const genres = await Genres.find().sort('name');
    res.send(genres);
    }
    catch(er){
        res.status(500).send('SOmething went wrong try again');
    }
});

router.get('/:id', async (req, res) => {

    try {
        const gen = await Genres.findById(req.params.id);
        // console.log('block passed');
        // const gen = genres.find(c => c.id === parseInt(req.params.id));
        // if (req.params.id != gen._id) return res.status(404).send('data not found 2');
        res.send(gen);
    }
    catch (error) {

        res.status(404).send('Data not found');
        console.log(error);
    }


});



//*POST
router.post('/',auth, async (req, res) => {    //*in routers the second parameter can be a middleware

    try {
        const val = validate(req.body);

        if (val.error) return res.status(400).send(val.error.details[0].message);


        let genre = new Genres({ name: req.body.name });

        genre = await genre.save()

        // let genre = await Genres.create({
        //     name: req.body.name
        // });
        res.send(genre);

    }
    catch (err) {
        res.status(400).send("Due to some internal issue POST method cant be performed");
        console.log(err);
    }
});



//*PUT
router.put('/:id',auth, async (req, res) => {

    try {
        const val = validate(req.body);
        if (val.error) return res.status(400).send(val.error.details[0].message);

        // const genFind = await Genres.findById(req.params.id);
        // if (!genFind) return res.status(404).send('data not found');


        const gen = await Genres.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });

        // const gen = await Genres.updateOne({ _id: req.params.id }, { name: req.body.name });


        res.send(gen);
    }
    catch (ex) {
        res.status(404).send('data not found');
        console.log(ex);

    }



});

//*DELETE
router.delete('/:id',[auth,admin], async (req, res) => {

    try {
        const gen = await Genres.findByIdAndRemove(req.params.id);

        res.send(gen);

    }
    catch (error) {
        res.status(404).send('data not found');

    }
});

module.exports = router;
