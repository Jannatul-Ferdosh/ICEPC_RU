const mongoose = require("mongoose");
const _ = require("lodash");
const logger = require('../utils/logger');
const fetch = require("node-fetch");
const { Profile } = require("./profile");

const Schema = mongoose.Schema;

// databse schema 
const codeforcesSchema = new Schema({
    rating: {
        type: Number,
        default: 0,
    },
    maxRating: {
        type: Number,
        default: 0,
    },
    rank: {
        type: String,
        default: "Newbie",
    },
    maxRank: {
        type: String,
        default: "Newbie",
    },
    solvedProblem: {
        type: Number,
        default: -1,
    },
    totalContest: {
        type: Number,
        default: 0,
    },
    updated: {
        type: Date,
        default: Date.now(),
    },
});

const Codeforces = mongoose.model("Codeforces", codeforcesSchema);

// Creating a codeforces for a new profile.
const createCodeforces = async (profileId, data) => {
    try {
        let codeforces = new Codeforces(
            _.pick(data, ["rating", "maxRating", "rank", "maxRank"])
        );
        codeforces = await codeforces.save();
        await Profile.findByIdAndUpdate(
            profileId,
            { codeforcesId: codeforces._id },
            { new: true }
        );
    } catch (error) {
        logger.info("Error creating Codeforces data ### (Creating):", error);
    }
};

// Updating a created codeforces database
const updateCodeforces = async (id, handle) => {
    const cfUrl = "https://codeforces.com/api/";
    try {
        // Upadating user info.
        const response = await fetch(`${cfUrl}user.info?handles=${handle}`);
        const userInfo = await response.json();

        // console.log(userInfo.status + '1');

        const data = userInfo.result[0];
        data.updated = new Date(Date.now());
        await Codeforces.findByIdAndUpdate(
            id,
            _.pick(data, ["rating", "maxRating", "rank", "maxRank", "updated"])
        );
    } catch (error) {
        logger.info("Error updating Codeforces data:", error);

        // console.log('Not OK' +'1');

        return;
    }
    try {
        await delay(3000);
        // Updating total solved problem count and total participated contest list from all submission of a user.
        const submissionsResponse = await fetch(
            `${cfUrl}user.status?handle=${handle}`
        );
        const submissionsData = await submissionsResponse.json();

        // console.log(submissionsData.status +'2');

        const submissions = submissionsData.result;

        // Counting all solved problem 
        const solvedProblemCount = new Set();
        for (let i in submissions) {
            const sub = submissions[i];
            if (sub.verdict === "OK") {
                solvedProblemCount.add(
                    sub.problem.id + sub.problem.index + sub.problem.name
                );
            }
        }

        // Counting rated contest
        await delay(3000);
        const contestResponse = await fetch(
            `${cfUrl}user.rating?handle=${handle}`
        );
        const contestData = await contestResponse.json();

        // console.log(contestData.status + '3');

        const contests = contestData.result;

        const ratedContestCount = contests.length;

        // Updating new data to the database
        await Codeforces.findByIdAndUpdate(id, {
            solvedProblem: solvedProblemCount.size,
            totalContest: ratedContestCount,
        });
    } catch (error) {
        logger.info("Error updating Codeforces data:... ( Section two) ", error);
        // console.log('Not OK' +'2 or 3');
    }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

exports.Codeforces = Codeforces;
exports.updateCodeforces = updateCodeforces;
exports.createCodeforces = createCodeforces;
