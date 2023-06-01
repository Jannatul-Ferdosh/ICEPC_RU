
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const _ = require('lodash');
const fs = require('fs');

const { Contest, validateContest } = require('../models/contest');
const { Profile } = require('../models/profile');
const { HomeData } = require('../models/homeData');

const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    const contests = await Contest.find().sort('date');
    res.send(contests);
});
router.get('/:id', async (req, res) => {
    const contest = await Contest.findById(req.params.id);
    res.send(contest);
});


router.post('/', auth, async (req, res) => {
    req.body.participant1 = JSON.parse(req.body.participant1);
    req.body.participant2 = JSON.parse(req.body.participant2);
    req.body.participant3 = JSON.parse(req.body.participant3);

    const {error} = validateContest(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    // Image upload handle
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let img = req.files.img1;
    let ext = img.mimetype.split("/")[1];
    let imgName =`${Math.random()*100}.${Date.now()}.${ext}`;
    
    let uploadPath = './public/images/contests/'+imgName;
    img.mv(uploadPath, (er) => {
        if(er) return res.send('File error');
    });

    let imgPath = '/images/contests/'+imgName;
    req.body.imgLink = [imgPath];

    img = req.files.img2;
    ext = img.mimetype.split("/")[1];
    imgName =`${Math.random()*100}.${Date.now()}.${ext}`;
    
    uploadPath = './public/images/contests/'+imgName;
    img.mv(uploadPath, (er) => {
        if(er) return res.send('File error');
    });

    imgPath = '/images/contests/'+imgName;
    req.body.imgLink.push(imgPath);

    img = req.files.img3;
    ext = img.mimetype.split("/")[1];
    imgName =`${Math.random()*100}.${Date.now()}.${ext}`;
    
    uploadPath = './public/images/contests/'+imgName;
    img.mv(uploadPath, (er) => {
        if(er) return res.send('File error');
    });

    imgPath = '/images/contests/'+imgName;
    req.body.imgLink.push(imgPath);

    img = req.files.img4;
    ext = img.mimetype.split("/")[1];
    imgName =`${Math.random()*100}.${Date.now()}.${ext}`;
    
    uploadPath = './public/images/contests/'+imgName;
    img.mv(uploadPath, (er) => {
        if(er) return res.send('File error');
    });

    imgPath = '/images/contests/'+imgName;
    req.body.imgLink.push(imgPath);


    let contest = new Contest(_.pick(req.body, [ 'imgLink', 'header', 'participant1','participant2','participant3', 'description', 'rank', 'link','date','isApproved','contestType']));
    contest = await contest.save();

    

    return res.send(contest);
});

router.put('/approve/:id', auth, async (req, res) => {
    const contest = await Contest.findByIdAndUpdate(req.params.id, {isApproved: req.body.isApproved}, {new: true});

    if(!contest) return res.status(404).send('The contest with the given id is not found');

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

    await Profile.findByIdAndUpdate(contest.participant1.profileId, {$push : {contests: contest._id}});
    await Profile.findByIdAndUpdate(contest.participant2.profileId, {$push : {contests: contest._id}});
    await Profile.findByIdAndUpdate(contest.participant3.profileId, {$push : {contests: contest._id}});

    return res.send(contest);
});

router.delete('/:id', auth, async (req, res) => {
    let contest = await Contest.findById(req.params.id);
    if(!contest) return res.status(404).send('The contest with the given id is not found');

    contest.imgLink.forEach((name) =>{
        const imgPath = './public'+name;
        fs.unlink(imgPath, (err) => {
            if(err) throw err;
        })
    });

    contest = await Contest.findByIdAndRemove(req.params.id);

    let homeData = await HomeData.find();

    if(contest.contestType === 'ICPC') await HomeData.findOneAndUpdate({_id: homeData[0]._id}, {$inc : {'ICPC': -1}});
    else if(contest.contestType === 'IUPC') await HomeData.findOneAndUpdate({_id: homeData[0]._id}, {$inc : {'IUPC': -1}});
    else await HomeData.findOneAndUpdate({_id: homeData[0]._id}, {$inc : {'IDPC': -1}});

    await Profile.findByIdAndUpdate(contest.participant1.profileId, {$pull : {contests: contest._id}});
    await Profile.findByIdAndUpdate(contest.participant2.profileId, {$pull : {contests: contest._id}});
    await Profile.findByIdAndUpdate(contest.participant3.profileId, {$pull : {contests: contest._id}});
    

    return res.send(contest);
});

module.exports = router;