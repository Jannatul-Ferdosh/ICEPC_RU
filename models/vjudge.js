const mongoose = require("mongoose");
const Joi = require('joi');
const _ = require("lodash");
const fetch = require("node-fetch");
const { Profile } = require("./profile");

const Schema = mongoose.Schema;

// databse schema 
const vjudgeSchema = new Schema({
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
        default: "64718aa3cde6d3c575b0f442"
    },
    points: {
        type: Array,
        default: [],
    },
    panalties: {
        type: Array,
        default: [],
    },
    totalPoints: {
        type: Number,
        default: 0
    },
    totalPanalties: {
        type: Number,
        default: 0
    },
    rating : {
        type: Number,
        default: 0.0
    }
});

const Vjudge = mongoose.model("Vjudge", vjudgeSchema);

function validateVjudge(vjudge){
    const schema = Joi.object({
        list: Joi.array().items(Joi.object({
            profileId: Joi.objectId().required(),
            points: Joi.number(),
            panalties: Joi.number(),
        }))
    });
    return schema.validate(vjudge);
}

exports.Vjudge = Vjudge;
exports.validateVjudge = validateVjudge;
