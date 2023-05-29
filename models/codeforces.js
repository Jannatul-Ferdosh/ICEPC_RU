const Joi = require("joi");
const mongoose = require("mongoose");
const _ = require("lodash");
const fetch = require("node-fetch");
const { Profile } = require("./profile");

const Schema = mongoose.Schema;

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
        console.error("Error creating Codeforces data:", error);
    }
};

const updateCodeforces = async (id, handle) => {
    const cfUrl = "https://codeforces.com/api/";
    try {
        const response = await fetch(`${cfUrl}user.info?handles=${handle}`);
        const userInfo = await response.json();
        const data = userInfo.result[0];
        data.updated = new Date(Date.now());
        await Codeforces.findByIdAndUpdate(
            id,
            _.pick(data, ["rating", "maxRating", "rank", "maxRank", "updated"])
        );
    } catch (error) {
        console.error("Error updating Codeforces data:", error);
        return;
    }
    try {
        const submissionsResponse = await fetch(
            `${cfUrl}user.status?handle=${handle}`
        );
        const submissionsData = await submissionsResponse.json();
        const submissions = submissionsData.result;

        const solvedProblemCount = new Set();
        for (let i in submissions) {
            const sub = submissions[i];
            if (sub.verdict === "OK") {
                solvedProblemCount.add(
                    sub.problem.id + sub.problem.index + sub.problem.name
                );
            }
        }
        const contestResponse = await fetch(
            `${cfUrl}user.rating?handle=${handle}`
        );
        const contestData = await contestResponse.json();
        const contests = contestData.result;

        const ratedContestCount = contests.length;

        await Codeforces.findByIdAndUpdate(id, {
            solvedProblem: solvedProblemCount.size,
            totalContest: ratedContestCount,
        });
    } catch (error) {
        console.error("Error updating Codeforces data:", error);
    }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

exports.Codeforces = Codeforces;
exports.updateCodeforces = updateCodeforces;
exports.createCodeforces = createCodeforces;
