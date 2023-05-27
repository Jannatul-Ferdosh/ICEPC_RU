const express = require('express');
const { User } = require('../models/user');
const router = express.Router();
const fetchUrl = require('fetch').fetchUrl;

const cf = require('../utils/cfcustom');
const { default: axios } = require('axios');

router.get('/', async (req, res) => {
    const cfUrl = 'https://codeforces.com/api/';
    try{
        axios.get(`${cfUrl}user.status?handle=asm_atikur`)
        .then((res) => {
            if (res.data.status === 'OK') throw new Error('Invalid handle');
        })
        .catch((err) => console.log(err));

    }
    catch(err) {
        return err;
    }
        

    
    // fetchUrl(`${cfUrl}user.status?handle=asm_atikur`, async (err, meta, body) => {
    //     if(err) throw err;

    //     const data = JSON.parse(body)['result'];
    //     const contestCount = new Set();
    //     const solvedProblemCount = new Set();
    //     for(let i in data){
    //         let sub = data[i];
    //         if(sub.author.participantType ==='CONTESTANT')
    //         {
    //             contestCount.add(sub.contestId);
    //         }
    //         if(sub.verdict ==='OK')
    //         {
    //             solvedProblemCount.add(`${sub.contestId}${sub.problem.index}`);
    //         }
    //     }
    //     console.log(contestCount.size);
    //     console.log(solvedProblemCount.size);
        
    // });

});



module.exports = router;