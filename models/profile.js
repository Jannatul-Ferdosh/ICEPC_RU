const Joi = require('joi');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;


// Profile schema for a user
const profileSchema =new Schema({
    name: {
        type: String,
        required: true
    },
    profilePicture : {
        type: String
    },
    bio : {
        type: String,
        required: true,
        minlength: 20
    },
    currentStatus: {
        type: String,
        required: true
    },
    contacts: {
        type: new Schema({
            phone: {
                type: Number,
                required: true,
            },
            email: {
                type: String,
                required: true
            },
            fbLink: {
                type: String
            },
            linkedinLink: {
                type: String
            }
        }),
        required: true
    },
    onlineJudgeLink : {
        type: new Schema({
            githubLink: {
                type: String
            },
            stopstalkLink: {
                type: String
            },
            codeforcesLink:{
                type: String
            },
            leetcodeLink: {
                type: String
            }
        }),
        required: true
    },
    onlineJudgeHandle : {
        type: new Schema({
            codeforces: {
                type: String
            },
            vjudge: {
                type: String
            }
        }),
        required: true
    },
    codeforcesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Codeforces',
        required: true,
        default: "64718aa3cde6d3c575b0f442"
    },
    sid : {
        type: String,
        required: true,
        minlength : 10,
        maxlength : 10
    },
    contests: {
        type: Array,
        default: []
    }
});


const Profile = mongoose.model('Profile', profileSchema);

// Validating data with joi module
function validateProfile(profile)
{
    const schema = Joi.object({
        sid: Joi.string().min(10).max(10).required(),
        name: Joi.string().required().min(3),
        
        profilePicture : Joi.optional(),
        bio : Joi.string().required().min(20),
        currentStatus: Joi.string().required(),
        contacts: Joi.object({
            phone: Joi.number().min(1000000000).max(1999999999).required(),
            email: Joi.string().email().required(),
            fbLink: Joi.string(),
            linkedinLink: Joi.string()
        }).required(),
        onlineJudgeLink : Joi.object({
            githubLink: Joi.string(),
            stopstalkLink: Joi.string(),
            codeforcesLink:Joi.string(),
            leetcodeLink: Joi.string()
        }).required(),
        onlineJudgeHandle: Joi.object({
            codeforces: Joi.string(),
            vjudge: Joi.string()
        }).required(),
        codeforcesId: Joi.objectId().optional(),

    });

    return schema.validate(profile);
}

exports.Profile = Profile;
exports.validateProfile = validateProfile;