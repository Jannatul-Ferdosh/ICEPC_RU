const {Photo, validatePhoto} = require('../models/photo');
const express = require('express');
const router = express.Router();
const fs = require('fs');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const superadmin = require('../middleware/superadmin');

// Geting all photos link
router.get('/', async (req,res) => {
    const photos = await Photo.find();
    return res.send(photos);
});

// Posting a new image 
router.post('/', [auth, admin], async (req, res) => {
    // Cheaking file existancy 
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // Creating unique name
    let img = req.files.photo;
    let ext = img.mimetype.split("/")[1];
    let imgName =`${Math.random()*100}.${Date.now()}.${ext}`;
    
    // Moving image to a folder in hosting
    let uploadPath = './public/images/gallery/'+imgName;
    img.mv(uploadPath, (er) => {
        if(er) return res.send('File error');
    });

    let imgPath = '/images/gallery/'+imgName;
    req.body.photoLink = imgPath;

    // Validating data
    const {error} = validatePhoto(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    // Creating new image database
    const photo = new Photo({photoLink: req.body.photoLink, description: req.body.description, heading: req.body.heading});
    await photo.save();
    res.send(photo);
});

router.delete('/:id', [auth, admin, superadmin], async (req, res) => {
    // Finding the photo details
    const photo = await Photo.findByIdAndRemove(req.params.id);

    if(!photo) return res.status(404).send('The photo with given ID is not found.');

    // Removing the photo
    const imgPath = './public'+photo.photoLink;
    fs.unlink(imgPath, (err) => {
        if(err) throw err;
    })

    res.send(photo);
});



module.exports = router;
