const mongoose  = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function() {
    const db = config.get('db');
    mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then( ()=> winston.info(`Connected to ${db}...`));
}

//catch willbe handled by uncaught exception as its not bound to express and shown in uncaughtexception.log


/*mongoose.connect('mongodb://localhost:27017/vidly',{ useNewUrlParser: true, useUnifiedTopology: true })
    .then( ()=> console.log('Connected to MongoDB...'))
    .catch( (err)=> console.log('Could not connect to MongoDB...'));
*/
