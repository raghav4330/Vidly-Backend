// asyncMiddleware = require('../middleware/async');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const {genreSchema, Genre, validate} = require('../modals/genre');

// if(express-async-errors dosent work which is required in index.js....then use below 
//     approach for all the functions.

/*router.get('/', asyncMiddleware(async (req, res, next)=>{
    const genres = await Genre.find().sort('name');
    res.send(genres);
}));*/

router.get('/', async (req, res, next)=>{
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

router.get('/:id', validateObjectId, async (req, res)=>{
    const genre = await Genre.findOne({_id: req.params.id});
    if(!genre) res.status(404).send('The genre with the specified id not found');
    res.send(genre);
});

router.post('/', auth, async (req, res)=>{
    const result = validate(req.body);
    if(result.error) return res.status(400).send(result.error.details[0].message);

    let genre = new Genre({
        name: req.body.name
    });
    genre = await genre.save();
    res.send(genre);
});

router.put('/:id', async (req,res)=>{
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate({_id: req.params.id},{
            $set: {
                name: req.body.name
            }
        }, {new: true});
    if(!genre) return res.status(404).send('The genre with the specified id not found');

    res.send(genre);
});

router.delete('/:id', [auth, admin], async (req,res) => {
    const genre = await Genre.findByIdAndRemove({_id: req.params.id});
    if(!genre) return res.status(404).send('The genre with the specified id not found');

    res.send(genre);
});


module.exports = router;