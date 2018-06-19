var path = require("path");
var fs = require("fs");
var path = require("path");

var rootDir = __dirname;

// Keys: wwwDir
var d = {};

// ============================================================================

module.exports.statSync = function(filePath) {
    return fs.statSync(filePath);
};

// Return string, or throws exception
module.exports.readFileString = function(filePath) {
    return fs.readFileSync(filePath, "utf8");
};

// ============================================================================

// Resolves paths relative to the project directory
// Allows the input of absolute paths
module.exports.projectPathUnsafe = function(inpath) {
    if (inpath.startsWith("/")) {
        return inpath;
    } else {
        return path.join(rootDir, inpath);
    }
};

// Resolves paths relative to the project directory
// Disallows absolute paths
module.exports.projectPathSafe = function(inpath) {
    inpath = inpath.split("..").join("");
    if (inpath.startsWith("/")) {
        return "";
    } else {
        return path.join(rootDir, inpath);
    }
};

module.exports.wwwPathSafe = function(wwwDir, inpath) {
    inpath = inpath.split("..").join("");
    if (inpath.startsWith("/")) {
        return "";
    } else {
        return path.join(wwwDir, inpath);
    }
};

module.exports.replace = function(s, match, rep) {
    return s.split(match).join(rep);
};
