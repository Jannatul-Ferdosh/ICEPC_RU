const express = require('express');

const notices = require('../routes/notices');





module.exports = function(app)
{
    app.use(express.json());

    app.use('/api/notices', notices);
}