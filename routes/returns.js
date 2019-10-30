const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { Customer } = require('../modals/customer');
const { Movie } = require('../modals/movie');
const { Rental} = require('../modals/rental');
const Fawn = require('fawn');

// Fawn.init(mongoose);

router.post('/', [auth, validate(validateReturn)], async (req, res)=>{

    const rental = await Rental.lookup(req.body.customerId, req.body.movieId); // this is the static method.

    if(!rental) return res.status(404).send('no rental found');

    if(rental.dayReturned) return res.status(400).send('rental already processed');
    
    rental.return();
    await rental.save();

    await Movie.update({_id: rental.movie._id}, {
        $inc: { numberInStock: 1}
    });

    return res.status(200).send(rental);
});

function validateReturn(rental) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    }
    return Joi.validate(rental, schema);
}

module.exports = router;