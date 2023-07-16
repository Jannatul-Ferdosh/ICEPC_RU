const mongoose = require("mongoose");
const Joi = require('joi');

const Schema = mongoose.Schema;

// databse schema 
const postSchema = new Schema({
    heading: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
});

const Post = mongoose.model("Post", postSchema);

const fileSchema = new Schema({
    heading: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: false
    }
});

const File = mongoose.model("File", fileSchema);



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

exports.Post = Post;
exports.File = File;

exports.validatePost = validatePost;
exports.validateFile = validateFile;
