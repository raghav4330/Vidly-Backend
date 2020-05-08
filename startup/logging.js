require('express-async-errors');

const winston = require('winston');
// require('winston-mongodb');

module.exports = function(){
    winston.handleExceptions(
        new winston.transports.Console({colorize: true, prettyPrint: true}),
        new winston.transports.File({filename: 'uncaughtExceptions.log'})
    );

    process.on('unhandledRejection',(ex)=>{ 
        throw ex;
    }); // because winston have method to catch exceptions and not rejections...so this a way out.


    winston.add(winston.transports.File, {filename: 'logfile.log'});// we can pass level also here
    // winston.add(winston.transports.MongoDB, {
    //     db: 'mongodb://localhost/vidly',
    //     level: 'info' // as info lies at level 3, so anything till 3rd level if logged...will be entered in db
    // });  commenting these 3 lines only for integrtion testing
}







/*process.on('uncaughtException',(ex)=>{  // we use events emitter to handle unhandled rejection(for promises) OR ucaught exception..these are not bound to express.
    winston.error(ex.message, ex);
    process.exit(1);
});
process.on('unhandledRejection',(ex)=>{ 
    winston.error(ex.message, ex);
    process.exit(1);
});*/
// THE ABOVE WAYS TO HANDLE UNCAUGHT. UNHADLED PROBLEMS CAN ALSO BE DONE USING WINSTON.handleException BY BELOW  METHOD.