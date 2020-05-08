const winston = require("winston");

module.exports = function (err, re1, res, next) {
  //  winston.log('error', err.message);  send levels in this method
  // winston.error(err.message);
  winston.error(err.message, err); // to show error stack also both in console and logfile(actually 2nd param is metadata )
  return res.status(500).send("Something Failed..");
};

// logging levels:
/*
    error
    warn
    info
    verbose
    debug
    silly
*/
