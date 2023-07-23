const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const _ = require('lodash');

const { HomeData } = require('../models/homeData');
const { Vjudge, validateVjudge } = require('../models/vjudge');

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const vlist = await Vjudge.find().select(['profileId', 'totalPoints', 'totalPanalties', 'rating']);
    return res.send(vlist);
});

router.get('/:id', async (req, res) => {
    const data = await Vjudge.findOne({profileId: req.params.id});
    if(!data) return res.send('Requested profile not found');
    return res.send(data);
});

router.post('/',[auth, admin], async (req, res) => {
    const {error} = validateVjudge(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    const vlist = req.body.list;
    const contestDate = Date.parse(req.body.date);
    const contestSetter = req.body.contestSetter;

    const setterdata = await Vjudge.findOne({profileId: contestSetter});
    let val = {
        point: setterdata.rating,
        date: contestDate
    };
    setterdata.points.push(val);
    val = {
        panaltie: 0,
        date: contestDate
    };
    setterdata.panalties.push(val);
    await setterdata.save();

    for (const data of vlist)
    {
        const currentdata = await Vjudge.findOne({profileId: data.profileId});
        let val = {
            point: data.points,
            date: contestDate
        };
        currentdata.points.push(val);
        val = {
            panaltie: data.panalties,
            date: contestDate
        };
        currentdata.panalties.push(val);

        await currentdata.save();
    }

    const programmers = await Vjudge.find();

    for(const currentdata of programmers)
    {
        // Updating Home Data
        let homeData = await HomeData.find();
        homeData[0].weeklycontestscount++;
        homeData[0].weeklycontests.push(contestDate);

        let contestlist = [];
        for(let i=0; i<homeData[0].weeklycontests.length; i++)
        {
            if(Date.now()-homeData[0].weeklycontests[i] <= (90*24*60*60*1000))
                {
                    contestlist.push(homeData[0].weeklycontests[i]);
                }
        }
        homeData[0].weeklycontests = contestlist;
        await homeData[0].save();


        
        const totalcontest = homeData[0].weeklycontests.length;


        let points = [], panalties = [];
        let tpoints=0, tpanalties=0;
        for(let i=0; i<currentdata.panalties.length; i++)
        {
            if(Date.now()-currentdata.points[i].date <= (90*24*60*60*1000))
            {
                points.push(currentdata.points[i]);
                panalties.push(currentdata.panalties[i]);
                tpoints += Number(currentdata.points[i].point);
                tpanalties += Number(currentdata.panalties[i].panaltie);
            }
        }
        currentdata.points = points;
        currentdata.panalties = panalties;
        currentdata.totalPoints = tpoints;
        currentdata.totalPanalties = tpanalties;

        points.sort(function(a,b){
            return b.point-a.point;
        });

        currentdata.rating = 0;
        for(let i=0; (i<points.length) && (i<=(0.7 * totalcontest)-1); i++)
        {
            currentdata.rating += Number(points[i].point);
        }
        currentdata.rating = currentdata.rating / Math.floor(0.7*totalcontest);
        
        await currentdata.save();
    }
    
    return res.send('ok');
});

module.exports = router;