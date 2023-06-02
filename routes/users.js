
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const {User, validateUser} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});


router.post('/', async(req, res) =>{
    const {error} = validateUser(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('User already registered...');

    user = new User(_.pick(req.body, ['sid', 'email', 'password','profileId']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    const token = user.generateAuthToken();
    await user.save();

    res.header('x-auth-token',token).header('access-control-expose-headers','x-auth-token').send(_.pick(user, ['_id', 'sid', 'email']));
});


module.exports = router;