const Joi = require('joi');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const contestSchema =new Schema({
    imgLink: {
        type: Array
    },
    header: {
        type: String,
        required: true,
        minlength: 10
    },
    participant1: {
        type: String,
        required: true
    },
    participant2: {
        type: String,
    },
    participant3: {
        type: String,
    },
    description: {
        type: String,
        required: true,
        minlength : 10,
    },
    rank: {
        type: String,
        required: true,
        minlength : 1
    },
    link : {
        type: String
    },
    isApproved: {
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});


const Contest = mongoose.model('Contest', contestSchema);

function validateContest(contest)
{
     const schema = Joi.object({
        imgLink: Joi.array().items(Joi.string()),
        header : Joi.string().min(10).required(),
        participant1: Joi.string().required().min(3),
        participant2: Joi.optional(),
        participant3: Joi.optional(),
        description: Joi.string().min(10).required(),
        rank: Joi.string().min(1).required(),
        link: Joi.optional(),
        date: Joi.date().required(),
        isApproved : Joi.boolean().required()
     });

     return schema.validate(contest);
}

exports.Contest = Contest;
exports.validateContest = validateContest;