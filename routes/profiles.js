
const auth = require('../middleware/auth');
const _ = require('lodash');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const {Profile, validateProfile} = require('../models/profile');
const express = require('express');
const { User } = require('../models/user');
const { createCodeforces, updateCodeforces, Codeforces } = require('../models/codeforces');
const { HomeData } = require('../models/homeData');
const { Vjudge } = require('../models/vjudge');
const router = express.Router();


// Getting data of a user from the jwt token
router.get('/me',auth, async (req, res) => {
    // Decoding the jwt token
    const jwtDecoded = jwt.verify(req.headers['x-auth-token'], process.env.jwtPrivateKey);
    // Finding the profile
    let profile = await Profile.findById(jwtDecoded.profileId).populate('codeforcesId');
    if(!profile) return res.status(404).send('The Profile with the given id is not found');

    // Updating codeforces account if needed
    const codeforces = profile.codeforcesId;
    const date = codeforces.updated;
    const currentDate = new Date(Date.now());
    if(codeforces.solvedProblem ===-1 || date.getDate() != currentDate.getDate() || date.getMonth() != currentDate.getMonth() || date.getFullYear() != currentDate.getFullYear())
    {
        await updateCodeforces(codeforces._id, profile.onlineJudgeHandle.codeforces);
    }
    // Sending the profile with updated codeforces database
    profile = await Profile.findById(jwtDecoded.profileId).populate('codeforcesId');
    if(!profile) return res.status(404).send('The Profile with the given id is not found');
    res.send(profile);
});

// Getting profile data from profile id
router.get('/:id', async (req, res) => {
    let profile = await Profile.findById(req.params.id).populate('codeforcesId');
    if(!profile) return res.status(404).send('The Profile with the given id is not found');

    // Updating codeforces database if needed.
    const codeforces = profile.codeforcesId;
    const date = codeforces.updated;
    const currentDate = new Date(Date.now());
    if(codeforces.solvedProblem ===-1 || date.getDate() != currentDate.getDate() || date.getMonth() != currentDate.getMonth() || date.getFullYear() != currentDate.getFullYear())
    {
        await updateCodeforces(codeforces._id, profile.onlineJudgeHandle.codeforces);
    }

    // Sending prfile with updated codeforces data
    profile = await Profile.findById(req.params.id).populate('codeforcesId');
    if(!profile) return res.status(404).send('The Profile with the given id is not found');
    res.send(profile);
});

// Uploading profile picture
router.post('/profilePicture/:id', auth, async (req, res) => {

    // Finding the profile
    let profile = await Profile.findById(req.params.id);
    if(!profile) return res.status(404).send('The Profile with the given id is not found');

    // Image upload handling
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // Creating unique name
    let img = req.files.profilePicture;
    let ext = img.mimetype.split("/")[1];
    let imgName =`${Math.random()*100}.${Date.now()}.${ext}`;
    
    // Moving the file to a folder 
    let uploadPath = './public/images/profiles/'+imgName;
    img.mv(uploadPath, (er) => {
        if(er) return res.send('File error');
    });

    let imgPath = '/images/profiles/'+imgName;

    profile.profilePicture = imgPath;
    
    profile = await profile.save();

    res.send(profile);
    
});

// Changing an existing profile picture
router.put('/profilePicture/:id', auth, async (req, res) => {

    // Finding the profile
    let profile = await Profile.findById(req.params.id);
    if(!profile) return res.status(404).send('The Profile with the given id is not found');

    // Image upload handling
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // Creating unique name
    let img = req.files.profilePicture;
    let ext = img.mimetype.split("/")[1];
    let imgName =`${Math.random()*100}.${Date.now()}.${ext}`;
    
    // Moving the file to a folder 
    let uploadPath = './public/images/profiles/'+imgName;
    img.mv(uploadPath, (er) => {
        if(er) return res.send('File error');
    });

    let imgPath = '/images/profiles/'+imgName;

    // Removing previous image
    fs.unlink('./public'+profile.profilePicture, (err) => {
        if(err) throw err;
    });

    profile.profilePicture = imgPath;
    
    profile = await profile.save();

    res.send(profile);
    
});

// Creating a new profile.
router.post('/', auth, async (req, res) => {
    // Adding sid from user to profile
    const jwtDecoded = jwt.verify(req.headers['x-auth-token'], process.env.jwtPrivateKey);
    req.body.sid = jwtDecoded.sid;

    // Validating the post request
    const {error} = validateProfile(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    req.body.profilePicture = "";

    // Validating Codeforces handle...
    const cfUrl = "https://codeforces.com/api/";
    let data;
    try {
        const response = await fetch(`${cfUrl}user.info?handles=${req.body.onlineJudgeHandle.codeforces}`);
        data = await response.json();
    } catch (error) {
        console.error("Error updating Codeforces data:", error);
        return;
    }
    if(data.status !='OK') return res.status(404).send('Handle Invalid');

    req.body.onlineJudgeHandle.codeforces = data.result[0].handle;

    //Creating the profile and saving it
    let profile = new Profile(_.pick(req.body, [ 'name', 'sid','profilePicture', 'bio','currentStatus', 'contacts', 'onlineJudgeLink', 'onlineJudgeHandle']));
    profile = await profile.save();

    // Creating Vjudge Profile
    let vprofile = new Vjudge({profileId: profile._id});
    await vprofile.save();

    // For updating HomeData object 
    let homeData = await HomeData.find();
    if(!homeData.length)
    {
        homeData = new HomeData();
        await homeData.save();
        homeData = [homeData];
    }
    await HomeData.findOneAndUpdate({_id: homeData[0]._id}, {$inc : {'programmers' : 1}});
    
    //Creating Codeforces for a profile
    await createCodeforces(profile._id, data);

    //Updating the JWT token and sending to frontend
    let user = await User.findOneAndUpdate({sid: jwtDecoded.sid},{profileId : profile._id, isUpdated: true},{new:true});
    const token = user.generateAuthToken();

    return res.send(token);
});

// Updating an existing profile
router.put('/:id', auth, async (req, res) => {
    // Adding sid from user to profile
    const jwtDecoded = jwt.verify(req.headers['x-auth-token'], process.env.jwtPrivateKey);
    req.body.sid = jwtDecoded.sid;

    // Validating the post request
    const {error} = validateProfile(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    let profile = await Profile.findById(req.params.id);
    if(!profile) return res.status(404).send('The Profile with the given id is not found');

    req.body.profilePicture = profile.profilePicture;

    // Validating Codeforces handle...
    const cfUrl = "https://codeforces.com/api/";
    let data;
    try {
        const response = await fetch(`${cfUrl}user.info?handles=${req.body.onlineJudgeHandle.codeforces}`);
        data = await response.json();
    } catch (error) {
        logger.info("Error updating Codeforces data:(Update)", error);
        return;
    }
    if(data.status !='OK') return res.status(404).send('Handle Invalid');

    req.body.onlineJudgeHandle.codeforces = data.result[0].handle;
    // Updating profile with new data
    profile = await Profile.findByIdAndUpdate(req.params.id, _.pick(req.body, [ 'name', 'profilePicture', 'bio','currentStatus', 'contacts', 'onlineJudgeLink', 'onlineJudgeHandle']), {new:true});
    if(!profile) return res.status(404).send('The profile with the given id is not found');

    // Updating codeforces database
    await updateCodeforces(profile.codeforcesId, profile.onlineJudgeHandle.codeforces);

    return res.send(profile);
});

module.exports = router;