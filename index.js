const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/prod')(app);

const port = process.env.PORT || 4000 ;
const server = app.listen(port, ()=> winston.info(`listening on port ${port}...`));

module.exports = server; // exporting only for integration testing


//throw new Error('Something Failed During Startup');
/*const p = Promise.reject(new Error('Something Failed Miserbaley!'));
p.then(()=>console.log('Done'));*/





