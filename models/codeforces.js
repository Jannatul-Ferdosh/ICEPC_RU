const Joi = require('joi');
const mongoose = require('mongoose');
const fetchUrl = require('fetch').fetchUrl;
const _ = require('lodash');
const { Profile } = require('./profile');

const Schema = mongoose.Schema;


const codeforcesSchema =new Schema({
    rating: {
        type: Number,
        default: 0
    },
    maxRating: {
        type: Number,
        default:0
    },
    rank: {
        type: String,
        default: 'Newbie'
    },
    maxRank: {
        type: String,
        default: 'Newbie'
    },
    solvedProblem: {
        type: Number,
        default:-1
    },
    totalContest: {
        type: Number,
        default:0
    },
    updated:{
        type: Date,
        default: Date.now()
    }
});


const Codeforces = mongoose.model('Codeforces', codeforcesSchema);

const createCodeforces = async (profileId,handle) => {
    const cfUrl = 'https://codeforces.com/api/';
    fetchUrl(`${cfUrl}user.info?handles=${handle}`, async (err, meta, body) => {
        if(err){
            throw err;
        }
        if(JSON.parse(body).status != 'OK')
        {
            throw new Error('Invalid Handle');
        }
        const data = JSON.parse(body).result[0];
        let codeforces = new Codeforces(_.pick(data, ['rating', 'maxRating', 'rank', 'maxRank']));
        
        codeforces = await codeforces.save();

        await Profile.findByIdAndUpdate(profileId,{codeforcesId : codeforces._id},{new:true});

    });


};

const updateCodeforces = async (id, handle) => {

    const cfUrl = 'https://codeforces.com/api/';
    fetchUrl(`${cfUrl}user.info?handles=${handle}`, async (err, meta, body) => {
        if(err){
            throw err;
        }
        const data = JSON.parse(body).result[0];
        data.updated = new Date(Date.now());
        await Codeforces.findByIdAndUpdate(id, _.pick(data, ['rating', 'maxRating', 'rank', 'maxRank', 'updated']));
    });
    fetchUrl(`${cfUrl}user.status?handle=${handle}`, async (err, meta, body) => {
        if(err) throw err;

        const data = JSON.parse(body)['result'];
        const contestCount = new Set();
        const solvedProblemCount = new Set();
        for(let i in data){
            let sub = data[i];
            if(sub.author.participantType ==='CONTESTANT')
            {
                contestCount.add(sub.contestId);
            }
            if(sub.verdict ==='OK')
            {
                solvedProblemCount.add(`${sub.contestId}${sub.problem.index}`);
            }
        }
        await Codeforces.findByIdAndUpdate(id, {solvedProblem: solvedProblemCount.size, totalContest: contestCount.size});
        
    });
    

};




exports.Codeforces = Codeforces;
exports.updateCodeforces = updateCodeforces;
exports.createCodeforces = createCodeforces;