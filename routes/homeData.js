const {HomeData} = require('../models/homeData');
const express = require('express');
const router = express.Router();


router.get('/', async (req,res) => {
    const homeData = await HomeData.findById(process.env.homeData);
    res.send(homeData);
});

router.get('/up', async(req,res) =>{
    const data = await HomeData.findOneAndUpdate({_id: process.env.homeData}, {$inc : {'programmers' : 1}});
    res.send(data);
})

module.exports = router;
