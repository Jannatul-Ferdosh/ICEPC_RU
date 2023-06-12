require('dotenv').config();
const { createLogger, transports, format} = require('winston');
require('winston-mongodb');


// Creating loger to show error in a descriptive way and store in database also
const logger = createLogger({
    transports: [
        new transports.Console({
            level: 'info',
            format: format.combine(format.timestamp(), format.simple())
        }),
        // new transports.File({
        //     filename: 'error.log',
        //     level: 'info',
        //     format: format.combine(format.timestamp(), format.simple())
        // }),
        // new transports.MongoDB({
        //     level: 'info',
        //     db: process.env.DB_URL,
        //     options:{
        //         useUnifiedTopology: true
        //     },
        //     collection: "serverlog",
        //     format: format.combine(format.timestamp(), format.simple())
        // }),
    ],
    exceptionHandlers: [
        new transports.Console({
            level: 'info',
            format: format.combine(format.timestamp(), format.simple())
        }),
        // new transports.MongoDB({
        //     level: 'info',
        //     db: process.env.DB_URL,
        //     options:{
        //         useUnifiedTopology: true
        //     },
        //     collection: "uncaught_serverlog",
        //     format: format.combine(format.timestamp(), format.simple())
        // })
      ],
    exitOnError: false
})

module.exports = logger;