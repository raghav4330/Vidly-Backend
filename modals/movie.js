const Joi = require('joi');
Joi.objectId = require('joi-objectid');
const mongoose  = require('mongoose');
const {genreSchema} = require('./genre');

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number, 
        required: true,
        min: 0,
        max: 1000
    },
    dailyRentalRate: {
        type: Number, 
        required: true,
        min: 0,
        max: 255
    }
}) );

function validateMovie(movie) {
    const schema = {
        title: Joi.string().min(2).max(50).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    }
    return Joi.validate(movie, schema);
}

module.exports.Movie = Movie;
module.exports.validate = validateMovie;