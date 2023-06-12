const {HomeData} = require('../models/homeData');
const express = require('express');
const router = express.Router();


// Getting all data of Home Page
router.get('/', async (req,res) => {
    let homeData = await HomeData.find();
    if(!homeData.length)
    {
        homeData = new HomeData();
        await homeData.save();
        homeData = [homeData];
    }
    res.send(homeData[0]);
});

module.exports = router;
