var utils = require("./utils.js");

var priv = {};

// <mdString> is a full MD format document
// <return> a string for the title of the MD document, parsed from the
// first top-level header. Returns an empty string if no title is found
module.exports.parseTitle = function(mdString) {

    if (!utils.isString(mdString)) {
        return "";
    }

    // Split the first line
    var mdSplit = mdString.split("\n", 1);
    var firstLine = mdSplit[0];

    // Check first line content
    if (firstLine.startsWith("#")) {
        firstLine = priv.removeInitialChars(firstLine, '#');
        firstLine = priv.removeInitialChars(firstLine, ' ');
        return firstLine;
    } else {
        return "";
    }

};

// ============================================================================

// Removes starting # symbols from <line>
priv.removeInitialChars = function(line, matchToken) {

    for (var i = 0; i < line.length; i++) {
        var c = line[i];
        if (c != matchToken) {
            return line.substring(i);
        }
    }

    return "";

}