const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const express = require('express');
const { Post, File , validatePost, validateFile} = require('../models/resourse');
const router = express.Router();

router.get('/posts', async (req, res) => {
    let posts = await Post.find();
    return res.send(posts);
});
router.get('/posts/:id', async (req, res) => {
    let post = await Post.findById(req.params.id);
    return res.send(post);
});

router.get('/files', async (req, res) => {
    let files = await File.find();
    return res.send(files);
});

router.post('/post', async (req, res) => {
    const {error} = validatePost(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    const post = new Post(req.body);

    await post.save();
    return res.status(200).send(post);
});

router.post('/file', async (req, res) => {
    const {error} = validateFile(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    

    let file = req.files.file;
    
    let ext = file.name.split(".")[1];
    let fileName =`${Math.random()*100}.${Date.now()}.${ext}`;

    let uploadPath = './public/files/resources/'+fileName;
    file.mv(uploadPath, (er) => {
        if(er) return res.send('File error');
    });
    
    let filePath = '/files/resources/'+fileName;

    const newfile  = new File({heading: req.body.heading, path: filePath});

    await newfile.save();
    return res.status(200).send('OK');
});


module.exports = router;