const axios = require('axios');

const fetchUrl = require('fetch').fetchUrl;

module.exports.getData = async (handle) => {
    const cfUrl = 'https://codeforces.com/api/';
    let cfData = {
        maxRating: "",
        maxRank: "",
        currentRating: "",
        currentRank: "",
        totolContest: "",
        totalSolvedProblem: ""
    };

    // fetchUrl(`${cfUrl}user.info?handles=${handle}`, (err, meta, body) => {

    //     const data = JSON.parse(body).result[0];

    //     cfData.maxRank = data.maxRank;
    //     cfData.currentRank = data.rank;
    //     cfData.maxRating = data.maxRating;
    //     cfData.currentRating = data.rating;
    //     return cfData;
    // });

    // fetchUrl(`${cfUrl}user.info?handles=${handle}`).then(() => console.log(JSON.parse(body).result[0]));
    // fetch(`${cfUrl}user.info?handles=${handle}`)
    //     .then((res) => {
    //         console.log(res);
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     })

    axios.get(`${cfUrl}user.info?handles=${handle}`)
        .then((res,cfData)=>{
            cfData.maxRank = res.data.result[0].maxRank;
            // console.log(res.data.);
            console.log(cfData);
        })
        .catch((err) => {
            console.log(err);
        })

};


