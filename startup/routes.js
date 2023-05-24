const express = require('express');

const notices = require('../routes/notices');
const users = require('../routes/users');
const auth = require('../routes/auth');





module.exports = function(app)
{
    app.use(express.json());

    app.use('/api/notices', notices);
    app.use('/api/users', users);
    app.use('/api/auth', auth);
}