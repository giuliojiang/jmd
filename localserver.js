// Paths can be relative to this directory,
// or absolute if they start with a /
var configData = {
    template: "etc/template.html",
    www: "etc/www"
}

var app = require("./app.js").createApp(configData);

const PORT = 3000;

app.listen(PORT, function() {
    console.info("Listening on port " + PORT);
});