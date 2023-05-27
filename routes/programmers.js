
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const { createCodeforces, updateCodeforces } = require('../models/codeforces');
const { Profile } = require('../models/profile');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    const jwtDecoded = jwt.verify(req.headers['x-auth-token'], process.env.jwtPrivateKey);
    
    let programmer = await User.findById(jwtDecoded._id).populate()
});



module.exports = router;