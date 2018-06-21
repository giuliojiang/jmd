var jmd = require("./app.js");
const express = require('express')
const app = express()

var config = {
    template: "etc/template.html",
    www: "etc/www"
};

app.use('/', jmd.createApp(config));

app.listen(3000, () => console.log('Example app listening on port 3000!'))