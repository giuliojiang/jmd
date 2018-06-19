const express = require("express");
var bodyParser = require('body-parser');
const appgetroute = require("./appgetroute.js");

module.exports.createApp = function() {

    var app = express();

    app.use(bodyParser.text());

    app.get("/*", function(req, res) {
        var routePath = req.params[0];
        appgetroute.handleGet(routePath, res);
    });

    return app;
};