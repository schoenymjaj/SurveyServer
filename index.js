const express = require('express');
const app     = express();

//setup logging for entire rest api
let globals   = require('./lib/globals');
let configLog = require('./lib/logger/logger');  //logger functions
let data = require('./lib/data/data');           //data functions

//pull logger config parms from the JSON for defaults and load into globals.
globals.loggerConfigParms = require('./lib/logger/log-config-parms');
globals.logger            = configLog.configlogger(globals.loggerConfigParms.mode);

console.log("Added CORS headers including Authorization");
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

const basicRouter        = require('./routers/basic.router');

const config = require('./config/config');

globals.logger.log('verbose');

const errorLogger       = require('./middleware/errorLogger.middleware');
const userRequestLogger = require('./middleware/userRequestLogger');

const body_parser = require('body-parser');
app.use(body_parser.urlencoded({
    'extended': 'true'
}));
app.use(body_parser.json());

const http = require('http').Server(app);

app.use(userRequestLogger);

globals.logger.log('verbose',"Initial Mongo database enabled:" + config.dbenabled);
console.log("Initial Mongo database enabled:" + config.dbenabled)
if (config.dbenabled == 'true') {
    data.performDataSetup();
}

app.use('/', basicRouter);

app.use(errorLogger);

http.listen(config.port);
globals.logger.log('verbose', "Listening on " + config.port);
console.log("Listening on " + config.port);
globals.logger.log('verbose',"Mongo database enabled:" + config.dbenabled);
console.log("Mongo database enabled:" + config.dbenabled)

