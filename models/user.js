require('dotenv').config();
const jwt = require('jsonwebtoken');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    sid : {
        type: String,
        required: true,
        minlength : 10,
        maxlength : 10
    },
    email : {
        type: String,
        unique: true,
        required: true
    },
    password : {
        type: String,
        require: true
    },
    profileId:{
        type: String,
        required:true
    },
    isUpdated: {
        type: Boolean,
        required: true
    },
    isAdmin : {
        type: Boolean,
        required: true
    },
    isSuperAdmin : {
        type: Boolean,
        required: true
    }
});


userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id,sid: this.sid,profileId: this.profileId, isAdmin: this.isAdmin, isSuperAdmin: this.isSuperAdmin, isUpdated: this.isUpdated}, process.env.jwtPrivateKey);
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user)
{
    const schema = Joi.object({
        sid: Joi.string().min(10).max(10).required(),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        profileId: Joi.objectId().required(),
        isUpdated: Joi.boolean().required(),
        isAdmin: Joi.boolean().required(),
        isSuperAdmin: Joi.boolean().required()
    });

    return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;