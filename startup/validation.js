const Joi = require('joi');

// Add joi validation for mongoose ObjectId
module.exports = function() {
    Joi.objectId = require('joi-objectid')(Joi);
}