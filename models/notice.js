const Joi = require('joi');
const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    date : {
        type : Date,
        require:true
    },
    header: {
        type: String,
        require: true,
        minlength: 5,
        maxlength: 200
    },
    programDate: {
        type: Date
    },
    description: {
        type: String,
        require: true,
        minlength:5
    },
    link: {
        type: String
    },
    banner: {
        type: String
    }
});

const Notice = mongoose.model('Notice', noticeSchema);

function validateNotice(notice)
{
    const schema = Joi.object({
        date : Joi.date().required(),
        header: Joi.string().required().min(5).max(200),
        programDate: Joi.date(),
        description: Joi.string().required().min(5),
        link: Joi.string(),
        banner: Joi.string()
    });

    return schema.validate(notice);
}

exports.Notice = Notice;
exports.validateNotice = validateNotice;
exports.noticeSchema = noticeSchema;