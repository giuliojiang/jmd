const express = require("express");
var bodyParser = require('body-parser');
const appgetroute = require("./appgetroute.js");
var config = require("./config.js");

module.exports.createApp = function(configData) {

    var context = {};

    config.setData(context, configData);
    
    var app = express();

    app.use(bodyParser.text());

    app.get("/*", function(req, res) {
        var routePath = req.params[0];
        appgetroute.handleGet(context, routePath, res);
    });

    return app;
};