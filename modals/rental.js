const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const moment = require('moment');

const rentalSchema = new mongoose.Schema({
    customer:{
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            },
            isGold: {type: Boolean, default: false},
            phone: {
                type: String,
                required: true,
                min: 5,
                max: 15
            }
        }),
        required: true
    },
    movie:{
        type: new mongoose.Schema({
            title: {
                type: String,
                trim: true,
                minlength: 2,
                maxlength: 50,
                required: true
             },
             dailyRentalRate: {
                type: Number, 
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dayOut: {
        type: Date,
        default: Date.now,
        required: true
    },
    dayReturned: {
        type: Date,
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

rentalSchema.methods.return = function(){
    this.dayReturned = new Date();
    const rentalDays = moment().diff(this.dayOut, 'days');
    this.rentalFee = rentalDays * this.movie.dailyRentalRate;
}

rentalSchema.statics.lookup = function(customerId, movieId){
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    });
}
const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    }
    return Joi.validate(rental, schema);
}

module.exports.Rental = Rental;
module.exports.validate = validateRental;