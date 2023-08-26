const { updateCodeforces } = require('../models/codeforces');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();

// Custom delay function call for handling codeforce api call limit
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Getting all programmers profile 
router.get('/', async (req, res) => {
  // Getting the list
  let programmers = await User.find({ isUpdated: true }).populate([
    { path: 'profileId', select: ['name', 'onlineJudgeHandle'], populate: { path: 'codeforcesId' } },
  ]).select(['sid', 'email']);
  res.send(programmers)

  // Updating all profiles of the users in background.
  for (const programmer of programmers) {
    const date = programmer.profileId.codeforcesId.updated;
    const currentDate = new Date(Date.now());

    if (programmer.profileId.codeforcesId.solvedProblem === -1 ||
      date.getDate() !== currentDate.getDate() ||
      date.getMonth() !== currentDate.getMonth() ||
      date.getFullYear() !== currentDate.getFullYear()
    ) {
      await delay(2500);
      await updateCodeforces(programmer.profileId.codeforcesId._id, programmer.profileId.onlineJudgeHandle.codeforces);
    }
  }
});

// Getting only requre data to use in dropdown 
router.get('/list', async (req, res) => {
  let programmers = await User.find({ isUpdated: true }).populate([{ path: 'profileId', select: ['name', 'onlineJudgeHandle'] }]).select(['sid']);
  return res.send(programmers);
});

module.exports = router;