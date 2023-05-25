
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const _ = require('lodash');
const fs = require('fs');

const {Profile, validateProfile} = require('../models/profile');
const express = require('express');
const router = express.Router();


// router.get('/', async (req, res) => {
//     const contests = await Contest.find().sort('date');
//     res.send(contests);
// });


router.post('/', auth, async (req, res) => {
    const {error} = validateProfile(req.body);
    if(error) return res.status(404).send(error.details[0].message);

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

    let imgPath = '/images/contests/'+imgName;
    req.body.profilePicture = imgPath;

    let profile = new Profile(_.pick(req.body, [ 'name', 'profilePicture', 'bio','currentStatus', 'contacts', 'onlineJudgeLink', 'onlineJudgeHandle']));

    profile = await profile.save();
    return res.send(profile);
});

// router.delete('/:id', auth, async (req, res) => {
//     let contest = await Contest.findById(req.params.id);
//     if(!contest) return res.status(404).send('The contest with the given id is not found');

//     contest.imgLink.forEach((name) =>{
//         const imgPath = './public'+name;
//         fs.unlink(imgPath, (err) => {
//             if(err) throw err;
//         })
//     });

//     contest = await Contest.findByIdAndRemove(req.params.id);

//     if(!contest) return res.status(404).send('The contest with the given id is not found');

//     return res.send(contest);
// });

module.exports = router;