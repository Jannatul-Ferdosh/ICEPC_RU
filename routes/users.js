
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const {User, validateUser, validateAdmin} = require('../models/user');
const express = require('express');
const router = express.Router();

// Getting user data from jwt token
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

// Getting User list
router.get('/list', async (req, res) => {
    const users = await User.find().populate([{ path: 'profileId', select: ['name', 'contacts'] }]).select(['sid', 'isAdmin']);
    res.send(users);
});

// Creating a new user
router.post('/', async(req, res) =>{
    // Validaiting sended data
    const {error} = validateUser(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    // Checking for user existness
    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('User already registered...');

    // Creating new user
    user = new User(_.pick(req.body, ['sid', 'email', 'password','profileId']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // Generating auth token
    const token = user.generateAuthToken();
    await user.save();

    // Sending response and give access to header of the response
    res.header('x-auth-token',token).header('access-control-expose-headers','x-auth-token').send(_.pick(user, ['_id', 'sid', 'email']));
});

router.put('/', async(req, res) =>{
    // Validaiting sended data
    const {error} = validateAdmin(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    // Checking for user existness
    let user = await User.findOne({_id: req.body.Id});
    if(!user) return res.status(400).send('User with the userID is not found');

    user.isAdmin = req.body.isAdmin;

    await user.save();

    // Sending response and give access to header of the response
    res.send(_.pick(user, ['_id', 'sid', 'email']));
});


module.exports = router;