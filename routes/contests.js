
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const _ = require('lodash');
const fs = require('fs');

const {Contest, validateContest} = require('../models/contest');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    const contests = await Contest.find().sort('date');
    res.send(contests);
});


router.post('/', auth, async (req, res) => {
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


    let contest = new Contest(_.pick(req.body, [ 'imgLink', 'header', 'participant1','participant2','participant3', 'description', 'rank', 'link','date','isApproved']));

    contest = await contest.save();
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

    if(!contest) return res.status(404).send('The contest with the given id is not found');

    return res.send(contest);
});

module.exports = router;