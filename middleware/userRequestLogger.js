'use strict';

const globals        = require('../lib/globals');
const clone          = require('clone');


module.exports = async function (req, res, next) {
    const crLF = '\r\n';
    let beginLogStr = ('BEGIN ' + req.path).toUpperCase();

    //copy to local variables. strictly to make the deviceid more readable when logging
    let reqLocalBody = JSON.parse(JSON.stringify(req.body));
    let reqLocalQuery = JSON.parse(JSON.stringify(req.query));
    
    beginLogStr += ' req.body:' + JSON.stringify(reqLocalBody);
    beginLogStr += ' req.query:' + JSON.stringify(reqLocalQuery);

    globals.logger.log('verbose', beginLogStr);
    next();


};