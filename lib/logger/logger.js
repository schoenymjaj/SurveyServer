const winston = require('winston');
const globals = require('../globals');
const fs = require('fs');

var configlogger = function(modeInp) {

    //Set local config variables from globals
    if (modeInp == globals.modeType.default) {
        logDirectory = './' + globals.loggerConfigParms.logDirectory + '/';
        logFilename = globals.loggerConfigParms.logFilename;
        logSubdirectory = globals.loggerConfigParms.logSubdirectory;
    } else {
        logDirectory = './' + globals.loggerConfigParms.logDirectory + '/';
        logFilename = globals.loggerConfigParms.logFilename;        
        logSubdirectory = globals.loggerConfigParms.logSubdirectory;
    }
    if (logSubdirectory != '') logSubdirectory += '/';

    try {
        fs.statSync(logDirectory);
    } catch(e) {
        fs.mkdirSync(logDirectory);
    }
    try {
        fs.statSync(logDirectory + logSubdirectory);
    } catch(e) {
        fs.mkdirSync(logDirectory + logSubdirectory);
    }
    logLevel = globals.loggerConfigParms.logLevel;    

    var logger = new (winston.Logger)({                                                                                     
        transports: [
        new (winston.transports.Console)(),                                                                                                             
        // new (winston.transports.File)({
        //     name: 'verbose-file-json',                                                                                 
        //     filename: logDirectory + logSubdirectory + logFilename + '-verbose-json.json',                                                                                  
        //     json : true,
        //     level: 'verbose',
        //     colorize: false,
        //     maxFiles: globals.loggerConfigParms.maxFiles,
        //     maxSize: globals.loggerConfigParms.maxSize,
        //     timestamp: function() { return (new Date()).toLocaleString();}
        // }),
        // new (winston.transports.File)({                                                                                 
        //     name: 'error-file-json',                                                                                 
        //     filename: logDirectory + logSubdirectory + logFilename + '-error-json.json',                                                                                  
        //     json : true,
        //     level: 'error',
        //     colorize: false,
        //     maxFiles: globals.loggerConfigParms.maxFiles,
        //     maxSize: globals.loggerConfigParms.maxSize,
        //     timestamp: function() { return (new Date()).toLocaleString();}
        // }),
        new (winston.transports.File)({                                                                                 
            name: 'content-recorder-json',                                                                                 
            filename: logDirectory + logSubdirectory + logFilename + '-content-recorder.json',                                                                                  
            json : true,
            level: 'info',
            colorize: false,
            maxFiles: globals.loggerConfigParms.maxFiles,
            maxSize: globals.loggerConfigParms.maxSize,
            timestamp: function() { return (new Date()).toLocaleString();}
        }),    
        // new (winston.transports.File)({                                                                                 
        //     name: 'debug-file-json',                                                                                 
        //     filename: logDirectory + logSubdirectory + logFilename + '-debug-json.json',                                                                                  
        //     json : true,
        //     level: 'debug',
        //     colorize: false,
        //     maxFiles: globals.loggerConfigParms.maxFiles,
        //     maxSize: globals.loggerConfigParms.maxSize,
        //     timestamp: function() { return (new Date()).toLocaleString();}
        // }),    
        new (winston.transports.File)({
            name: 'verbose-file-text',                                                                                 
            filename: logDirectory + logSubdirectory + logFilename + '-verbose-text.log',                                                                                  
            json : false,
            level: 'verbose',
            colorize: false,
            maxFiles: globals.loggerConfigParms.maxFiles,
            maxSize: globals.loggerConfigParms.maxSize,
            timestamp: function() { return (new Date()).toLocaleString();}
        }),
        new (winston.transports.File)({                                                                                 
            name: 'error-file-text',                                                                                 
            filename: logDirectory + logSubdirectory + logFilename + '-error-text.log',                                                                                  
            json : false,
            level: 'error',
            colorize: false,
            maxFiles: globals.loggerConfigParms.maxFiles,
            maxSize: globals.loggerConfigParms.maxSize,
            timestamp: function() { return (new Date()).toLocaleString();}
        }),
        new (winston.transports.File)({                                                                                 
            name: 'content-recorder-text',                                                                                 
            filename: logDirectory + logSubdirectory + logFilename + '-content-recorder.log',                                                                                  
            json : true,
            level: 'info',
            colorize: false,
            maxFiles: globals.loggerConfigParms.maxFiles,
            maxSize: globals.loggerConfigParms.maxSize,
            timestamp: function() { return (new Date()).toLocaleString();}
        }),            
        new (winston.transports.File)({
            name: 'debug-file-text',                                                                                 
            filename: logDirectory + logSubdirectory + logFilename + '-debug-text.log',                                                                                  
            json : false,
            level: 'debug',
            colorize: false,
            maxFiles: globals.loggerConfigParms.maxFiles,
            maxSize: globals.loggerConfigParms.maxSize,
            timestamp: function() { return (new Date()).toLocaleString();}
        })
        ]                                                                                                                 
    });   

        //windows.handleExceptions commands below work.
        winston.handleExceptions(
            new winston.transports.File(
                    { name: 'exception-file-text',
                    filename: logDirectory + logSubdirectory + logFilename + '-exceptions-text.log',
                    json: false }
            )
        );
        winston.handleExceptions(
            new winston.transports.File(
                    { name: 'exception-file-json',
                    filename: logDirectory + logSubdirectory + logFilename + '-exceptions-json.log',
                    json: true }
            )
        );

        //set the level of logging. 'debug' will log all levels. 
        //{ emerg: 0, alert: 1, crit: 2, error: 3, warning: 4, notice: 5, info: 6, debug: 7 }
        winston.level = logLevel; //will log all winston messages at this level
        logger.level = logLevel;
        logger.exitOnError = false; //Specify that Winston will not exit when encountering an error

        return logger;

    //mongodb://<dbuser>:<dbpassword>@ds135926.mlab.com:35926/ivas-logs
    //ds135926.mlab.com:35926/ivas-logs
    // ATTEMPT TO INSTANTIATE WINSTON MONGODB TO LOG TO MONGODB. HAVEN'T FIGURED OUT 
    // THE DB, HOST SPECIFICATION THAT WORKS YET - MNS 4/17/18
    //   new(winston.transports.MongoDB)({
        //     db: 'ivas-logs',
        //     host : 'mlab.com',
        //     username : 'tyrod',
        //     password : 'tyrod',
        //     port: '35926'            
        // })                                                                                                                   
    
    /*   var dblogger = new(winston.Logger)({
        transports : [
            new(winston.transports.MongoDB)({
                db : 'logs',
                host : db.dbUrl,
                username : 'username',
                password : 'password'            
            })
        ]
    });  */

}

/*
set globals logger configuration based on the ApI request data
*/
var setLogConfig = function(req) {

    logConfigDirty = false;
    if (req.query.logdirectory) {
        globals.loggerConfigParms.logDirectory = req.query.logdirectory;
        logConfigDirty = true;
    }
    if (req.query.logsubdirectory) {
        globals.loggerConfigParms.logSubdirectory = req.query.logsubdirectory;
        logConfigDirty = true;
    }
    if (req.query.logfilename) {
        globals.loggerConfigParms.logFilename = req.query.logfilename;
        logConfigDirty = true;
    }
    if (req.query.logmaxfiles) {
        globals.loggerConfigParms.logMaxFiles = req.query.logmaxfiles;
        logConfigDirty = true;
    }
    if (req.query.logmaxsize) {
        globals.loggerConfigParms.logMaxSize = req.query.logmaxsize;
        logConfigDirty = true;
    }
    if (req.query.loginfojsonInd) {
        globals.loggerConfigParms.logInfoJsonInd = req.query.loginfojsonInd;
        logConfigDirty = true;
    }
    if (req.query.loginfotextind) {
        globals.loggerConfigParms.loginfoTextInd = req.query.loginfotextind;
        logConfigDirty = true;
    }
    if (req.query.logdebugjsonind) {
        globals.loggerConfigParms.logDebugJsonInd = req.query.logdebugjsonind;
        logConfigDirty = true;
    }
    if (req.query.logdebugtextind) {
        globals.loggerConfigParms.logDebugTextInd = req.query.logdebugtextind;
        logConfigDirty = true;
    }
    if (req.query.mode) {
        globals.loggerConfigParms.mode = req.query.mode;
        logConfigDirty = true;
    } 
    if (req.query.loglevel) {
        globals.loggerConfigParms.logLevel = req.query.loglevel;
        logConfigDirty = true;
    }         
  
    if (logConfigDirty) {
        globals.logger = configlogger(globals.loggerConfigParms.mode);
        return true;
    } else {
        return false; //return false because nothing has changed with logger
    }
      
}

module.exports = {
    configlogger: configlogger,
    setLogConfig: setLogConfig
}

