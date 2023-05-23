require('dotenv').config();
const logger = require('./utils/logger');
const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();
require('./startup/prod')(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.info(`Listening in PORT ${port}`));

module.exports = server;
