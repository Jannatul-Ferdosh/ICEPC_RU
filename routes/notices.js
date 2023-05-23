const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const {Notice, validateNotice} = require('../models/notice');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.get('/', async (req,res) => {
    const notices = await Notice.find().sort('date');
    res.send(notices);
});

router.post('/', async (req, res) => {
    const {error} = validateNotice(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    let notice = new Notice({
        date : req.body.date,
        header : req.body.header,
        programDate : req.body.programDate,
        description : req.body.description,
        link : req.body.link,
        banner : req.body.banner
    });
    notice = await notice.save();
    res.send(notice);
});

router.delete('/:id', async (req, res) => {
    const notice = await Notice.findByIdAndRemove(req.params.id);

    if(!notice) return res.status(404).send('The notice with given ID is not found.');

    res.send(notice);
});



module.exports = router;
