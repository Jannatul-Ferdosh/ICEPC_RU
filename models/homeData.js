const mongoose = require('mongoose');

// Some data to show in home page
const homeDataSchema = new mongoose.Schema({
    IUPC: {
        type: Number,
        default: 0
    },
    ICPC: {
        type: Number,
        default: 0
    },
    IDPC: {
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
