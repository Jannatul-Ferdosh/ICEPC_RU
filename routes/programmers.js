
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
    let programmers = await User.find().populate([{path:'profileId', select: ['name','onlineJudgeHandle','codeforcesId'],populate:{path: 'onlineJudgeHandle'}, populate: {path:'codeforcesId'}}]).select(['sid', 'email']);
    console.log(programmers);
    programmers.forEach((programmer) => {
        const date = programmer.profileId.codeforcesId.updated;
        const currentDate = new Date(Date.now());
        if(programmer.profileId.codeforcesId.solvedProblem ===-1 || date.getDate() != currentDate.getDate() || date.getMonth() != currentDate.getMonth() || date.getFullYear() != currentDate.getFullYear())
        {
            updateCodeforces(programmer.profileId.codeforcesId._id, programmer.profileId.onlineJudgeHandle.codeforces);
        }
    });
    programmers = await User.find().populate([{path:'profileId', select: ['name','onlineJudgeHandle'], populate: {path:'codeforcesId'}}]).select(['sid', 'email']);

    return res.send(programmers);
});



module.exports = router;