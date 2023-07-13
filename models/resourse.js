const mongoose = require("mongoose");
const Joi = require('joi');

const Schema = mongoose.Schema;

// databse schema 
const resourcesSchema = new Schema({
    posts: {
        type: Array,
        default: [],
    },
    files: {
        type: Array,
        default: [],
    }
});

const Resources = mongoose.model("Resources", resourcesSchema);

function validatePost(post){
    const schema = Joi.object({
        heading: Joi.string().required(),
        text: Joi.string().required()
    });
    return schema.validate(post);
}
function validateFile(file){
    const schema = Joi.object({
        heading: Joi.string().required()
    });
    return schema.validate(file);
}

exports.Resources = Resources;
exports.validatePost = validatePost;
exports.validateFile = validateFile;
