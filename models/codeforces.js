const Joi = require('joi');
const mongoose = require('mongoose');
const fetchUrl = require('fetch').fetchUrl;
const _ = require('lodash');
const { User } = require('./user');

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
        default:0
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

const createCodeforces = async (userId,handle) => {
    const cfUrl = 'https://codeforces.com/api/';
    fetchUrl(`${cfUrl}user.info?handles=${handle}`, async (err, meta, body) => {
        if(err){
            throw err;
        }
        const data = JSON.parse(body).result[0];
        let codeforces = new Codeforces(_.pick(data, ['rating', 'maxRating', 'rank', 'maxRank']));
        
        codeforces = await codeforces.save();

        await User.findByIdAndUpdate(userId,{codeforcesId : codeforces._id},{new:true});
        
    });
    

};

const updateCodeforces = async (id, handle) => {
    const cfUrl = 'https://codeforces.com/api/';
    fetchUrl(`${cfUrl}user.info?handles=${handle}`, async (err, meta, body) => {
        if(err){
            throw err;
        }

        const data = JSON.parse(body).result[0];
        await Codeforces.findByIdAndUpdate(id, _.pick(data, ['rating', 'maxRating', 'rank', 'maxRank']));
    });
    

};




exports.Codeforces = Codeforces;
exports.updateCodeforces = updateCodeforces;
exports.createCodeforces = createCodeforces;