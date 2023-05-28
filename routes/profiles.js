
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const _ = require('lodash');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const fetchUrl = require('fetch').fetchUrl;

const {Profile, validateProfile} = require('../models/profile');
const express = require('express');
const { User } = require('../models/user');
const { createCodeforces, updateCodeforces, Codeforces } = require('../models/codeforces');
const { HomeData } = require('../models/homeData');
const router = express.Router();


router.get('/me', async (req, res) => {
    const jwtDecoded = jwt.verify(req.headers['x-auth-token'], process.env.jwtPrivateKey);
    let profile = await Profile.findById(jwtDecoded.profileId);

    const codeforces = await Codeforces.findById(profile.codeforcesId);
    const date = codeforces.updated;
    const currentDate = new Date(Date.now());
    if(codeforces.solvedProblem ===-1 || date.getDate() != currentDate.getDate() || date.getMonth() != currentDate.getMonth() || date.getFullYear() != currentDate.getFullYear())
    {
        await updateCodeforces(codeforces._id, profile.onlineJudgeHandle.codeforces);
    }
    profile = await Profile.findById(jwtDecoded.profileId).populate('codeforcesId');
    if(!profile) return res.status(404).send('The Profile with the given id is not found');
    res.send(profile);
});

router.get('/:id', async (req, res) => {
    let profile = await Profile.findById(req.params.id);

    const codeforces = await Codeforces.findById(profile.codeforcesId);
    const date = codeforces.updated;
    const currentDate = new Date(Date.now());
    if(codeforces.solvedProblem ===-1 || date.getDate() != currentDate.getDate() || date.getMonth() != currentDate.getMonth() || date.getFullYear() != currentDate.getFullYear())
    {
        await updateCodeforces(codeforces._id, profile.onlineJudgeHandle.codeforces);
    }

    profile = await Profile.findById(req.params.id).populate('codeforcesId');
    if(!profile) return res.status(404).send('The Profile with the given id is not found');
    res.send(profile);
});

router.post('/profilePicture/:id', auth, async (req, res) => {

    let profile = await Profile.findById(req.params.id);
    if(!profile) return res.status(404).send('The Profile with the given id is not found');

    // Image upload handle
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let img = req.files.profilePicture;
    let ext = img.mimetype.split("/")[1];
    let imgName =`${Math.random()*100}.${Date.now()}.${ext}`;
    
    let uploadPath = './public/images/profiles/'+imgName;
    img.mv(uploadPath, (er) => {
        if(er) return res.send('File error');
    });

    let imgPath = '/images/profiles/'+imgName;

    profile.profilePicture = imgPath;
    
    profile = await profile.save();

    res.send(profile);
    
});
router.put('/profilePicture/:id', auth, async (req, res) => {

    let profile = await Profile.findById(req.params.id);
    if(!profile) return res.status(404).send('The Profile with the given id is not found');

    // Image upload handle
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let img = req.files.profilePicture;
    let ext = img.mimetype.split("/")[1];
    let imgName =`${Math.random()*100}.${Date.now()}.${ext}`;
    
    let uploadPath = './public/images/profiles/'+imgName;
    img.mv(uploadPath, (er) => {
        if(er) return res.send('File error');
    });

    let imgPath = '/images/profiles/'+imgName;

    fs.unlink('./public'+profile.profilePicture, (err) => {
        if(err) throw err;
    });

    profile.profilePicture = imgPath;
    
    profile = await profile.save();

    res.send(profile);
    
});

router.post('/', auth, async (req, res) => {
    const {error} = validateProfile(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    req.body.profilePicture = "";
    async function call(handle){
        return await new Promise(resolve => {
            fetchUrl(`https://codeforces.com/api/user.info?handles=${handle}`, async (err, meta, body) => {
                const data = JSON.parse(body);
                resolve(data);
            });
        })
    };

    const data = await call(req.body.onlineJudgeHandle.codeforces);
    if(data.status !='OK') return res.status(404).send('Handle Invalid');


    let profile = new Profile(_.pick(req.body, [ 'name', 'profilePicture', 'bio','currentStatus', 'contacts', 'onlineJudgeLink', 'onlineJudgeHandle']));

    profile = await profile.save();
    await HomeData.findOneAndUpdate({_id: process.env.homeData}, {$inc : {'programmers' : 1}});

    const jwtDecoded = jwt.verify(req.headers['x-auth-token'], process.env.jwtPrivateKey);
    await createCodeforces(profile._id, data);

    let user = await User.findByIdAndUpdate(jwtDecoded._id,{profileId : profile._id, isUpdated: true},{new:true});
    const token = user.generateAuthToken();

    return res.send(token);
});

router.put('/:id', auth, async (req, res) => {
    const {error} = validateProfile(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    let profile = await Profile.findById(req.params.id);
    if(!profile) return res.status(404).send('The Profile with the given id is not found');

    req.body.profilePicture = profile.profilePicture;

    async function call(handle){
        return await new Promise(resolve => {
            fetchUrl(`https://codeforces.com/api/user.info?handles=${handle}`, async (err, meta, body) => {
                const data = JSON.parse(body);
                resolve(data);
            });
        })
    };
    const data = await call(req.body.onlineJudgeHandle.codeforces);
    if(data.status !='OK') return res.status(404).send('Handle Invalid');

    profile = await Profile.findByIdAndUpdate(req.params.id, _.pick(req.body, [ 'name', 'profilePicture', 'bio','currentStatus', 'contacts', 'onlineJudgeLink', 'onlineJudgeHandle']), {new:true});
    if(!profile) return res.status(404).send('The profile with the given id is not found');

    updateCodeforces(profile.codeforcesId, profile.onlineJudgeHandle.codeforces);

    return res.send(profile);
});

module.exports = router;