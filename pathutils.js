var path = require("path");
var fs = require("fs");

// Returns an object with properties
// {
//     exists
//     isfile
// }
module.exports.fileProperties = function(filePath) {

    try {
        var stats = fs.statSync();
        return {
            exists: true,
            isfile: stats.isFile()
        };
    } catch (err) {
        return {
            exists: false
        };
    }

};

// Return string, or throws exception
module.exports.readFileString = function(filePath) {
    return fs.readFileSync(filePath, "utf8");
};