const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const express = require('express');
const { Resources, validatePost, validateFile} = require('../models/resourse');
const router = express.Router();

router.get('/', async (req, res) => {
    let resources = await Resources.find();
    if(!resources.length)
    {
        resources = new Resources({});
        await resources.save();
        return res.send(resources);
    }
    return res.send(resources[0]);
});

router.post('/post', async (req, res) => {
    const {error} = validatePost(req.body);
    if(error) return res.status(404).send(error.details[0].message);
    
    let resources = await Resources.find();
    if(!resources.length)
    {
        resources = new Resources({});
    }
    else resources = resources[0];

    resources.posts.push(req.body);

    await resources.save();
    return res.status(200).send(resources);
});

router.post('/file', async (req, res) => {
    const {error} = validateFile(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    
    let resources = await Resources.find();
    if(!resources.length)
    {
        resources = new Resources({});
    }
    else resources = resources[0];

    let file = req.files.file;
    let ext = file.mimetype.split("/")[1];
    let fileName =`${Math.random()*100}.${Date.now()}.${ext}`;

    let uploadPath = './public/files/resources/'+fileName;
    file.mv(uploadPath, (er) => {
        if(er) return res.send('File error');
    });
    
    let filePath = '/files/resources/'+fileName;

    resources.files.push({heading: req.body.heading, path: filePath});

    await resources.save();
    return res.status(200).send('OK');
});


module.exports = router;