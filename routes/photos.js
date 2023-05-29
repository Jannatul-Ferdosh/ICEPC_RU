const {Photo, validatePhoto} = require('../models/photo');
const express = require('express');
const router = express.Router();


router.get('/', async (req,res) => {
    const photos = await Photo.find();
    return res.send(photos);
});

router.post('/', async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let img = req.files.photo;
    let ext = img.mimetype.split("/")[1];
    let imgName =`${Math.random()*100}.${Date.now()}.${ext}`;
    
    let uploadPath = './public/images/gallery/'+imgName;
    img.mv(uploadPath, (er) => {
        if(er) return res.send('File error');
    });

    let imgPath = '/images/gallery/'+imgName;
    req.body.imgLink = imgPath;


    const {error} = validatePhoto(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    const photo = new Photo({photoLink: req.body.photoLink, description: req.body.description, heading: req.body.heading});
    await photo.save();
    res.send(photo);
});

router.delete('/:id', async (req, res) => {
    const photo = await Photo.findByIdAndRemove(req.params.id);

    if(!photo) return res.status(404).send('The notice with given ID is not found.');
    const imgPath = './public'+photo.photoLink;
    fs.unlink(imgPath, (err) => {
        if(err) throw err;
    })

    res.send(photo);
});



module.exports = router;
