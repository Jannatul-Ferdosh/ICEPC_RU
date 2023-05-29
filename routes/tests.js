const express = require('express');
const { User } = require('../models/user');
const router = express.Router();
const fetchUrl = require('fetch').fetchUrl;

const cf = require('../utils/cfcustom');
const { default: axios } = require('axios');
const {updateCodeforces} = require('../models/codeforces');

router.get('/', async (req, res) => {
    // async function call(handle){
    //     return await new Promise(resolve => {
    //         fetchUrl(`https://codeforces.com/api/user.info?handles=${handle}`, async (err, meta, body) => {
    //             const data = JSON.parse(body);
    //             resolve(data);
    //         });
    //     })
    // };
    // const data = await call('asm_atikur');
    // console.log(data);

    // const cfUrl = 'https://codeforces.com/api/';
    // fetchUrl(`https://codeforces.com/api/user.info?handles=asm_atikur`, async (err, meta, body) => {
        
    //     const data = JSON.parse(body).result[0];
    //     console.log(data);

    // });
    updateCodeforces('64747a6a88b60e2d5b685772', 'asm_atikur');
    res.send('OK');
    

});



module.exports = router;