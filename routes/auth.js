const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express')
const router = express.Router();


// Cheking a log in 
router.post('/', async(req, res) =>{
    // Validating email
    const {error} = validateUser(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    // Finding the user
    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid email or password');

    // Comparing two password
    const validPassword = bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password');

    // Generating auth jwt token
    const token = user.generateAuthToken();
    res.send(token);
});


// Validating a login info
function validateUser(data)
{
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required()
    });
    return schema.validate(data);
}

module.exports = router;