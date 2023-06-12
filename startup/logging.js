require('express-async-errors');

// Handling unhandled promise rejection
module.exports = function() {
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });
}
