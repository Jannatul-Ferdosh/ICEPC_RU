
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
    
    let programmers = await User.find().populate([{path:'profileId', select: ['name','onlineJudgeHandle'], populate: {path:'codeforcesId'}}]).select(['sid', 'email']);

    programmers.forEach((programmer) => {
        const date = programmer.codeforcesId.updated;
        const currentDate = new Date(Date.now());
        if(programmer.codeforcesId.solvedProblem ===-1 || date.getDate() != currentDate.getDate() || date.getMonth() != currentDate.getMonth() || date.getFullYear() != currentDate.getFullYear())
        {
            updateCodeforces(programmer.codeforcesId._id, programmer.profileId.onlineJudgeHandle.codeforces);
        }
    });
    programmers = await User.find().populate([{path:'profileId', select: ['name','onlineJudgeHandle'], populate: {path:'codeforcesId'}}]).select(['sid', 'email']);

    return res.send(programmers);
});



module.exports = router;