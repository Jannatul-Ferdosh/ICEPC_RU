const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const {Notice, validateNotice} = require('../models/notice');
const express = require('express');
const router = express.Router();


// Getting all notices 
router.get('/', async (req,res) => {
    const notices = await Notice.find().sort('date');
    res.send(notices);
});

// Creting a new notice
router.post('/', [auth, admin], async (req, res) => {
    // Validating received data
    const {error} = validateNotice(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    // new entry
    let notice = new Notice({
        date : req.body.date,
        header : req.body.header,
        programDate : req.body.programDate,
        description : req.body.description,
        link : req.body.link,
        banner : req.body.banner
    });
    await notice.save();
    res.send(notice);
});

// Deleting a notice
router.delete('/:id', [auth, admin] , async (req, res) => {
    // Finding the notice from id
    const notice = await Notice.findByIdAndRemove(req.params.id);

    if(!notice) return res.status(404).send('The notice with given ID is not found.');

    res.send(notice);
});



module.exports = router;
