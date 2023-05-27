const express = require('express');
const { User } = require('../models/user');
const router = express.Router();
const fetchUrl = require('fetch').fetchUrl;

const cf = require('../utils/cfcustom');

router.get('/', async (req, res) => {
    // fetchUrl('https://codeforces.com/api/user.info?handles=asm_atikur', (err, meta, body) => {

    //     const data = JSON.parse(body).result[0];
    //     console.log(data.maxRating);

    //     return res.send(JSON.parse(body));
    // });

    // const user = await User.findById('6470c7a7c26911e685efb84c').populate({
    //     path: 'profileId',
    //     select: 'name'
    // });

    // return res.send(user);

    const ret = await cf.getData('asm_atikur');


    return res.send(ret);

});



module.exports = router;