const Joi = require('joi');
const mongoose = require('mongoose');

// Database schema
const noticeSchema = new mongoose.Schema({
    date : {
        type : Date,
        required:true
    },
    header: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 200
    },
    programDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true,
        minlength:5
    },
    link: {
        type: String
    },
    banner: {
        type: String, 
        required: true,
        default: '/images/notices/The_Professor.jpg'
    }
});

const Notice = mongoose.model('Notice', noticeSchema);


// Validating data with joi module
function validateNotice(notice)
{
    const schema = Joi.object({
        date : Joi.date().required(),
        header: Joi.string().required().min(5).max(200),
        programDate: Joi.date(),
        description: Joi.string().required().min(5),
        link: Joi.string().optional(),
        banner: Joi.string().optional()
    });

    return schema.validate(notice);
}

exports.Notice = Notice;
exports.validateNotice = validateNotice;
exports.noticeSchema = noticeSchema;