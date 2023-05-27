const _ = require('lodash');

const {About, validateAbout} = require('../models/about');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const about = await About.find();
    res.send(about);
});


router.post('/', async(req, res) =>{
    const {error} = validateAbout(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    let about = new About(_.pick(req.body, ['committee', 'studentCommittee']));
    about = await about.save();

    return res.send(about);
});

module.exports = router;