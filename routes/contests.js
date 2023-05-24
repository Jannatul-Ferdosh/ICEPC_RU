
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const _ = require('lodash');

const {Contest, validateContest} = require('../models/contest');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    const contests = await Contest.find();
    res.send(contests);
});


router.post('/', auth, async (req, res) => {
    const {error} = validateContest(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    let contest = new Contest(_.pick(req.body, [ 'imgLink', 'header', 'participant', 'description', 'rank', 'link']));

    contest = await contest.save();
    return res.send(contest);
});

router.put('/:id', auth, async (req, res) => {
    const {error} = validateContest(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    let contest = _.pick(req.body, [ 'imgLink', 'header', 'participant', 'description', 'rank', 'link']);


    contest = await Contest.findByIdAndUpdate(req.params.id, contest, {new:true});

    if(!contest) return res.status(404).send('The contest with the given id is not found');

    return res.send(contest);
});

router.delete('/:id', auth, async (req, res) => {
    const contest = await Contest.findByIdAndRemove(req.params.id);

    if(!contest) return res.status(404).send('The contest with the given id is not found');

    return res.send(contest);
});

module.exports = router;