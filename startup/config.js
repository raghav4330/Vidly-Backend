const config = require('config');

module.exports = function() {
    if(!config.get('jwtPrivateKey')){
        throw new Error('FATAL ERROR: jwtPrivateKey not defined'+config.get('jwtPrivateKey'));
        process.exit(1);
    }
}