var app = require("./app.js").createApp();

const PORT = 3000;

app.listen(PORT, function() {
    console.info("Listening on port " + PORT);
});