# JMD

JMD is a lightweight express-based app to quickly generate a website from markdown files.

# Quickstart

Add JMD to your Node.js project. If you don't have a project yet, use `npm init` (See https://docs.npmjs.com/cli/init).

```
npm --save install giuliojiang/jmd
```

```javascript
var jmd = require("jmd");
const express = require('express')
const app = express()

var config = {
    template: "etc/template.html",
    www: "etc/www"
};

app.use('/', jmd.createApp(config));

app.listen(3000, () => console.log('Example app listening on port 3000!'))
```