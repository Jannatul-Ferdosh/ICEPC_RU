const Joi = require('joi');
const mongoose = require('mongoose');


const photoSchema = new mongoose.Schema({
    photoLink: {
        type: String, 
        required: true,
        default: '/images/gallery/The_Professor.jpg'
    },
    description: {
        type: String,
        required: true
    }
});


const Photo = mongoose.model('Photo', photoSchema);

function validatePhoto(photo)
{
    const schema = Joi.object({
        photoLink: Joi.string().required(),
        description: Joi.string().required()
    });

    return schema.validate(photo);
}

exports.Photo = Photo;
exports.validatePhoto = validatePhoto;