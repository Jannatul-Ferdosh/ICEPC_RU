const express = require('express');
const upload = require('express-fileupload');

const notices = require('../routes/notices');
const users = require('../routes/users');
const auth = require('../routes/auth');
const contests = require('../routes/contests');
const profiles = require('../routes/profiles');





module.exports = function(app)
{
    app.use(express.json());
    app.use(upload());
    app.use('/api', express.static('public'));

    app.use('/api/notices', notices);
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use('/api/contests', contests);
    app.use('/api/profiles', profiles);
    
}