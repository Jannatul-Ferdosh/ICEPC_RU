const _ = require('lodash');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const superadmin = require('../middleware/superadmin');

const {About, validateAbout} = require('../models/about');
const express = require('express');
const router = express.Router();

// Getting all committee list
router.get('/', async (req, res) => {
    const about = await About.find();
    res.send(about);
});


// Creating a new committee
router.post('/', [auth,admin,superadmin], async(req, res) =>{
    // Validating received data
    const {error} = validateAbout(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    // Creating a new committee
    let about = new About(_.pick(req.body, ['committee', 'studentCommittee']));
    await about.save();

    return res.send(about);
});

// Updating an existing committee using id
router.put('/:id', [auth,admin,superadmin], async(req, res) =>{
    // Validating received Data 
    const {error} = validateAbout(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    // Updating the committee
    let about = await About.findByIdAndUpdate(req.params.id, _.pick(req.body, ['committee', 'studentCommittee']));

    return res.send(about);
});

module.exports = router;