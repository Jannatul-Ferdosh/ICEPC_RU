
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const superadmin = require('../middleware/superadmin');
const _ = require('lodash');
const fs = require('fs');

const { Contest, validateContest } = require('../models/contest');
const { Profile } = require('../models/profile');
const { HomeData } = require('../models/homeData');

const express = require('express');
const router = express.Router();

// Geting all contest info
router.get('/', async (req, res) => {
    const contests = await Contest.find().sort('date');
    res.send(contests);
});

// Getting a contest by id
router.get('/:id', async (req, res) => {
    const contest = await Contest.findById(req.params.id);
    res.send(contest);
});

// Creating  a new notice
router.post('/', auth, async (req, res) => {
    // Making object from form data that is send by string pursing
    req.body.participant1 = JSON.parse(req.body.participant1);
    req.body.participant2 = JSON.parse(req.body.participant2);
    req.body.participant3 = JSON.parse(req.body.participant3);

    // Validating received data
    const {error} = validateContest(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    // Image upload handle
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // Image 1
    // Creating unique name for image
    let img = req.files.img1;
    let ext = img.mimetype.split("/")[1];
    let imgName =`${Math.random()*100}.${Date.now()}.${ext}`;
    
    // Moving image to folder
    let uploadPath = './public/images/contests/'+imgName;
    img.mv(uploadPath, (er) => {
        if(er) return res.send('File error');
    });

    let imgPath = '/images/contests/'+imgName;
    req.body.imgLink = [imgPath];

    // Image 2
    img = req.files.img2;
    ext = img.mimetype.split("/")[1];
    imgName =`${Math.random()*100}.${Date.now()}.${ext}`;
    
    uploadPath = './public/images/contests/'+imgName;
    img.mv(uploadPath, (er) => {
        if(er) return res.send('File error');
    });

    imgPath = '/images/contests/'+imgName;
    req.body.imgLink.push(imgPath);

    // Image 3
    img = req.files.img3;
    ext = img.mimetype.split("/")[1];
    imgName =`${Math.random()*100}.${Date.now()}.${ext}`;
    
    uploadPath = './public/images/contests/'+imgName;
    img.mv(uploadPath, (er) => {
        if(er) return res.send('File error');
    });

    imgPath = '/images/contests/'+imgName;
    req.body.imgLink.push(imgPath);

    // Image 4
    img = req.files.img4;
    ext = img.mimetype.split("/")[1];
    imgName =`${Math.random()*100}.${Date.now()}.${ext}`;
    
    uploadPath = './public/images/contests/'+imgName;
    img.mv(uploadPath, (er) => {
        if(er) return res.send('File error');
    });

    imgPath = '/images/contests/'+imgName;
    req.body.imgLink.push(imgPath);


    // Creating a new contest.
    let contest = new Contest(_.pick(req.body, [ 'imgLink', 'header', 'participant1','participant2','participant3', 'description', 'rank', 'link','date','isApproved','contestType']));
    await contest.save();

    

    return res.send(contest);
});

// Aproving a contest by admin to show in contest list
router.put('/approve/:id', [auth,admin] , async (req, res) => {
    const contest = await Contest.findByIdAndUpdate(req.params.id, {isApproved: req.body.isApproved}, {new: true});

    if(!contest) return res.status(404).send('The contest with the given id is not found');

    // Updating home data info
    let homeData = await HomeData.find();
    if(!homeData.length)
    {
        homeData = new HomeData();
        await homeData.save();
        homeData = [homeData];
    }
    
    if(contest.contestType === 'ICPC') await HomeData.findOneAndUpdate({_id: homeData[0]._id}, {$inc : {'ICPC': 1}});
    else if(contest.contestType === 'IUPC') await HomeData.findOneAndUpdate({_id: homeData[0]._id}, {$inc : {'IUPC': 1}});
    else await HomeData.findOneAndUpdate({_id: homeData[0]._id}, {$inc : {'IDPC': 1}});

    // Adding contest to the student profile
    await Profile.findByIdAndUpdate(contest.participant1.profileId, {$push : {contests: contest._id}});
    await Profile.findByIdAndUpdate(contest.participant2.profileId, {$push : {contests: contest._id}});
    await Profile.findByIdAndUpdate(contest.participant3.profileId, {$push : {contests: contest._id}});

    return res.send(contest);
});

// Deleting a contest with id
router.delete('/:id', [auth,admin,superadmin], async (req, res) => {
    // Finding the contest
    let contest = await Contest.findById(req.params.id);
    if(!contest) return res.status(404).send('The contest with the given id is not found');

    // Removing all photos from hosting
    contest.imgLink.forEach((name) =>{
        const imgPath = './public'+name;
        fs.unlink(imgPath, (err) => {
            if(err) throw err;
        })
    });

    // Removing the contest
    contest = await Contest.findByIdAndRemove(req.params.id);

    // Updating homedata
    let homeData = await HomeData.find();

    if(contest.contestType === 'ICPC') await HomeData.findOneAndUpdate({_id: homeData[0]._id}, {$inc : {'ICPC': -1}});
    else if(contest.contestType === 'IUPC') await HomeData.findOneAndUpdate({_id: homeData[0]._id}, {$inc : {'IUPC': -1}});
    else await HomeData.findOneAndUpdate({_id: homeData[0]._id}, {$inc : {'IDPC': -1}});

    // Removing contest from Student profile
    await Profile.findByIdAndUpdate(contest.participant1.profileId, {$pull : {contests: contest._id}});
    await Profile.findByIdAndUpdate(contest.participant2.profileId, {$pull : {contests: contest._id}});
    await Profile.findByIdAndUpdate(contest.participant3.profileId, {$pull : {contests: contest._id}});
    

    return res.send(contest);
});

module.exports = router;