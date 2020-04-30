'use strict';

const express           = require('express');
let   basicRouter       = express.Router();

let globals   = require('../lib/globals');
const logger            = require('../lib/globals').logger;
const config = require('../config/config');


basicRouter.get("/read", async function (req, res, next) {
    globals.logger.log('verbose', "basicRouter/read start"); 
    console.log("basicRouter/read start"); 
    globals.logger.log('verbose', "req.query:" + JSON.stringify(req.query)); 
    console.log("req.query:" + JSON.stringify(req.query)); 

    res.send({"status": true});

    globals.logger.log('verbose', "basicRouter/read end"); 
    console.log("basicRouter/read end"); 
});

basicRouter.post('/create', async function (req, res) {
    globals.logger.log('verbose', "basicRouter/create start"); 
    console.log("basicRouter/create start"); 
    globals.logger.log('verbose', "req.query:" + JSON.stringify(req.query)); 
    console.log("req.query:" + JSON.stringify(req.query)); 
    globals.logger.log('verbose', "req.body:" + JSON.stringify(req.body)); 
    console.log("req.body:" + JSON.stringify(req.body)); 

    res.send({"status": true, "player": {"name": "mike", "ave": 0.345}});

    globals.logger.log('verbose', "basicRouter/create end"); 
    console.log("basicRouter/create end"); 
});

basicRouter.get("/help", async function (req, res) {
    globals.logger.log('verbose', "basicRouter/help start"); 
    console.log("basicRouter/help start"); 
    globals.logger.log('verbose', "req.query:" + JSON.stringify(req.query)); 
    console.log("req.query:" + JSON.stringify(req.query)); 

    res.send('response from help GET endpoint');

    globals.logger.log('verbose', "basicRouter/help end"); 
    console.log("basicRouter/help end"); 
});

basicRouter.get('/Unhandled', async function (req, res) {
    globals.logger.log('verbose', "basicRouter/Unhandled start"); 
    console.log("basicRouter/Unhandled start"); 
    globals.logger.log('verbose', "req.query:" + JSON.stringify(req.query)); 
    console.log("req.query:" + JSON.stringify(req.query)); 

    res.send('response from Unhandled GET endpoint');

    globals.logger.log('verbose', "basicRouter/Unhandled end"); 
    console.log("basicRouter/Unhandled end"); 
});


module.exports = basicRouter;
