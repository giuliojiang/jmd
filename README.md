# JMD

JMD is a lightweight express-based app to quickly generate a website from markdown files.

[Example website](https://osr.jstudios.ovh/)

# Quickstart

Add JMD to your Node.js project. If you don't have a project yet, use `npm init` (See https://docs.npmjs.com/cli/init).

```
npm --save install giuliojiang/jmd
```

Create a file `index.js`:

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

Save, and run

```
node index.js
```

Open your browser and point to http://localhost:3000/

You should be greeted by the homepage.

Customize the template file in `node_modules/jmd/etc/template.html` and the website in `node_modules/jmd/etc/www`, or use your own template and .md pages by changing the `config` object (it supports absolute paths).

# Template

The template file (default is in `node_modules/jmd/etc/template.html`) is an HTML file, and can be pointed to a different file in the config object.

The Markdown content will be inserted in the DOM element with the ID `jmd_content`. There are no other requirements on the template file, feel free to customize!

# Websites

The default website directory is `node_modules/jmd/etc/www` and can be pointed to a different directory in the config object.

`index.md` is your default homepage, and all other pages are found by name. If the browser path is `somepage`, jmd will attempt to open `somepage.md`. Directories are also supported.
