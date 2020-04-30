var globals = require('../globals');

module.exports = 
{
    logLevel: 'debug',
    logDirectory: './logs/',
    logSubdirectory: '',
    logFilename: 'ivas',
    logMaxFiles: 10,
    logMaxSize: 10000000,
    logInfoJsonInd: true,
    loginfoTextInd: true,
    logDebugJsonInd: true,
    logDebugTextInd: true,
    logActivityMap: false,
    mode: globals.modeType.default
};