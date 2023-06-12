const Joi = require('joi');
const mongoose = require('mongoose');

// Database schema
const photoSchema = new mongoose.Schema({
    photoLink: {
        type: String, 
        required: true,
        default: '/images/gallery/The_Professor.jpg'
    },
    description: {
        type: String,
        required: true
    },
    heading: {
        type: String,
        required:true
    }
});


const Photo = mongoose.model('Photo', photoSchema);

// Validating data with joi module
function validatePhoto(photo)
{
    const schema = Joi.object({
        photoLink: Joi.string().required(),
        description: Joi.string().required(),
        heading: Joi.string().required()
    });

    return schema.validate(photo);
}

exports.Photo = Photo;
exports.validatePhoto = validatePhoto;