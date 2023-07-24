const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const superadmin = require('../middleware/superadmin');

const bcrypt = require('bcrypt');
const _ = require('lodash');

const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const {User, validateUser, validateAdmin} = require('../models/user');
const express = require('express');
const router = express.Router();

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    service: process.env.SERVICE,
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS,
    }
});

// Getting user data from jwt token
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

// Getting User list
router.get('/list',[auth, admin, superadmin], async (req, res) => {
    const users = await User.find({ isUpdated: true }).populate([{ path: 'profileId', select: ['name', 'contacts'] }]).select(['sid', 'isAdmin']);
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
    await user.save();

    const {email} = req.body;
    try{
        const verificationToken = user.generateVerificationToken();

        const url = `${process.env.B_URL}/api/users/verify/${verificationToken}`;
        transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: 'Verify your ICE Programming Club profile',
            html: `Click <a href = '${url}'> here </a> to verify your email.`
        });
        return res.status(201).send(`Varificaition email send to ${email}`);
    } catch(err){
        return res.status(500).send(err);
    }
});


router.get('/verify/:token', async(req, res) => {
    const token = req.params.token;

    if(!token) return res.status(422).send('Invalid Link');

    let payload = null;
    try{
        payload = jwt.verify(token, process.env.userVerificationKey);
    } catch(err){
        return res.status(500).send(err);
    }

    try{
        const user = await User.findOne({_id: payload.ID}).exec();
        if(!user)
        {
            return res.status(404).send('User not exists');
        }

        user.isVerified = true;
        await user.save();

        return res.status(200).send('Account Verified...');
    } catch (err) {
        return res.status(500).send(err);
    }
});


router.post('/resetpassword', async(req,res) => {
    // Checking for user existness
    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('User not found...');

    const {email} = req.body;

    try{
        const url = `${process.env.F_URL}/users/verify/${user._id}`;
        transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: 'Reset your ICE Programming Club profiles\' password',
            html: `Click <a href = '${url}'> here </a> to reset your password.`
        });
        return res.status(201).send(`Password reset link send to ${email}`);
    } catch(err){
        return res.status(500).send(err);
    }
});


router.put('/newpassword', async(req, res) =>{
    // Validaiting sended data
    const {error} = validate(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    // Checking for user existness
    let user = await User.findOne({_id: req.body.Id});
    if(!user) return res.status(400).send('User with the userID is not found');

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    await user.save();

    // Sending response
    res.send('Password reseted...');
});

function validate(user)
{
    const schema = Joi.object({
        Id: Joi.objectId().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required()
    });

    return schema.validate(user);
}


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