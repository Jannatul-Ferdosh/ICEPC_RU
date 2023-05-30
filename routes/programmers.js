const { updateCodeforces } = require('../models/codeforces');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

router.get('/', async (req, res) => {
  let programmers = await User.find({ isUpdated: true }).populate([
    { path: 'profileId', select: ['name', 'onlineJudgeHandle'], populate: { path: 'codeforcesId' } },
  ]).select(['sid', 'email']);
  res.send(programmers)

  for (const programmer of programmers) {
    const date = programmer.profileId.codeforcesId.updated;
    const currentDate = new Date(Date.now());

    if (programmer.profileId.codeforcesId.solvedProblem === -1 ||
      date.getDate() !== currentDate.getDate() ||
      date.getMonth() !== currentDate.getMonth() ||
      date.getFullYear() !== currentDate.getFullYear()
    ) {
      await delay(3000); // Delay before making the next API call
      updateCodeforces(programmer.profileId.codeforcesId._id, programmer.profileId.onlineJudgeHandle.codeforces);
    }
  }
});

router.get('/list', async (req, res) => {
  let programmers = await User.find({ isUpdated: true }).populate([{ path: 'profileId', select: ['name'] }]).select(['sid']);
  return res.send(programmers);
});

module.exports = router;