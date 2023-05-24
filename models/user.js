require('dotenv').config();
const jwt = require('jsonwebtoken');
const Joi = require('joi');
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
    }
});


userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin, isSuperAdmin: this.isSuperAdmin}, process.env.jwtPrivateKey);
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user)
{
    const schema = Joi.object({
        sid: Joi.string().min(10).max(10).required(),
        email: Joi.string().required().email(),
        password: Joi.string().required()
    });

    return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;