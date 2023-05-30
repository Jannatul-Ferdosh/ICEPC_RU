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
    participant1: new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        profileId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile',
            required: true
        }
    }),
    participant2: new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        profileId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile',
            required: true
        }
    }),
    participant3: new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        profileId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile',
            required: true
        }
    }),
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
    },
    contestType: {
        type: String,
        enum : ['ICPC', 'IUPC', 'IDPC'],
        required: true
    }
});


const Contest = mongoose.model('Contest', contestSchema);

function validateContest(contest)
{
     const schema = Joi.object({
        imgLink: Joi.array().items(Joi.string()),
        header : Joi.string().min(10).required(),
        participant1: Joi.object({
            name: Joi.string().required(),
            profileId: Joi.objectId().required()
        }),
        participant2: Joi.object({
            name: Joi.string().required(),
            profileId: Joi.objectId().required()
        }),
        participant3: Joi.object({
            name: Joi.string().required(),
            profileId: Joi.objectId().required()
        }),
        description: Joi.string().min(10).required(),
        rank: Joi.string().min(1).required(),
        link: Joi.optional(),
        date: Joi.date().required(),
        isApproved : Joi.boolean().required(),
        contestType: Joi.string().valid('ICPC', 'IUPC', 'IDPC').required()
     });

     return schema.validate(contest);
}

exports.Contest = Contest;
exports.validateContest = validateContest;