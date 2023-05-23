const mongoose = require('mongoose');
const logger = require('../utils/logger');
require('dotenv').config();

module.exports = function(){
    mongoose.connect(process.env.DB_URL)
        .then(() => console.info(`Connected to DB.. ${process.env.DB_URL}`))
        .catch(err => logger.info('Error'));
}