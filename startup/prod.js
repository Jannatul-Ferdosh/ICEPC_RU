const helmet = require('helmet');
const compression = require('compression');

// Extra feature for creating production more efficient
module.exports = function(app){
    app.use(helmet());
    app.use(compression());
}