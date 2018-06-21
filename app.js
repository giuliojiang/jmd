const express = require("express");
var bodyParser = require('body-parser');
const appgetroute = require("./appgetroute.js");
var config = require("./config.js");

// configData should be an object like
// {
//     template: "path",
//     www: "path"
// }
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