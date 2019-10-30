const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Customer } = require('../modals/customer');
const { Movie } = require('../modals/movie');
const { Rental, validate } = require('../modals/rental');
const Fawn = require('fawn');

Fawn.init(mongoose);

router.get('/', async (req, res)=>{
    const rentals = await Rental.find().sort('-dayOut');
    res.send(rentals); 
});

router.get('/:id', async (req, res)=>{
    const rental = await Rental.find({_id: req.params.id});
    if(!rental) res.status(404).send('The rental with the specified id not found');
    res.send(rental);
});

router.post('/', async (req, res)=>{
    const result = validate(req.body);
    if(result.error) return res.status(400).send(result.error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('Inavlid customer');

    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send('Inavlid movie');

    console.log(customer);
    console.log(movie);

    if(movie.numberInStock === 0) return res.status(400).send('movie not in stock');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
    });

    try{
    new Fawn.Task()
        .save('rentals', rental)           // first parameter is the exact collection name(case sensistive and plural).
        .update('movies', {_id: movie._id},{
            $inc: {
                numberInStock: -1
            }
        })
        .run();
    }
    catch(ex){ return res.status(500).send('something falied..'); }
    
    res.send(rental);
});

module.exports = router;

// below is the way to see results of every transaction


/*task
    .update("Accounts", {firstName: "John", lastName: "Smith"}, {$inc: {balance: -20}})
    .update("Accounts", {firstName: "Broke", lastName: "Ass"}, {$inc: {balance: 20}})
    .run()
    .then(function(results){
        // task is complete 
    
        // result from first operation
        var firstUpdateResult = results[0];
    
        // result from second operation
        var secondUpdateResult = results[1];
  })
  .catch(function(err){
    // Everything has been rolled back.
    
    // log the error which caused the failure
    console.log(err);
  });*/