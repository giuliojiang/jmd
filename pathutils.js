var path = require("path");
var fs = require("fs");

// Returns an object with properties
// {
//     exists
//     isfile
// }
module.exports.statSync = function(filePath) {
    return fs.statSync(filePath);
};

// Return string, or throws exception
module.exports.readFileString = function(filePath) {
    return fs.readFileSync(filePath, "utf8");
};