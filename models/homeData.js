const mongoose = require('mongoose');

const homeDataSchema = new mongoose.Schema({
    ipuc: {
        type: Number,
        default: 0
    },
    icpc: {
        type: Number,
        default: 0
    },
    idpc: {
        type: Number,
        default: 0
    },
    programmers: {
        type: Number,
        default: 0
    }
});

const HomeData = mongoose.model('HomeData', homeDataSchema);


exports.HomeData = HomeData;
