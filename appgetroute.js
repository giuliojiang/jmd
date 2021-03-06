var expressresponse = require("./expressresponse.js");
var pathutils = require("./pathutils.js");
var path = require("path");
var transformer = require("./transformer.js");

// ============================================================================
module.exports.sanitizePath = function(path) {

    try {
        // Remove double paths
        path = pathutils.replace(path, "//", "/");

        // Remove ..
        path = pathutils.replace(path, "..", "");

        if (path.startsWith("/")) {
            // Attempts at absolute paths are rejected
            return "";
        }

        return path;
    } catch (err) {
        return null;
    }
};

module.exports.handleGet = function(context, req, routePath, res) {

    // Check validity of context
    if (!context || !context.www || !context.template) {
        throw Error("appgetroute.js:handleGet context is invalid. Context must be an object with www and template keys");
    }

    if (!res) {
        throw Error("res is null/undefined");
    }

    // Sanitize the path
    var filePath = module.exports.sanitizePath(routePath);
    if (filePath == null) {
        expressresponse.send404(res);
        return;
    }

    // To project path
    var filePath = pathutils.wwwPathSafe(context.www, filePath);

    // Check if the path is a directory
    var stats;
    try {
        stats = pathutils.statSync(filePath);
    } catch (err) {
        stats = null;
    }

    if (stats && stats.isDirectory()) {
        var newPath = req.baseUrl + req.url + "index";
        expressresponse.redirect(res, newPath);
    } else if (stats && stats.isFile()) {
        module.exports.handleRawFile(context, filePath, res);
    } else {
        module.exports.handlePage(context, filePath, res);
    }

};

// ============================================================================
module.exports.handleRawFile = function(context, filePath, res) {

    expressresponse.sendFile(res, filePath);

};

// ============================================================================
module.exports.handlePage = function(context, fileRoute, res) {

    // Append a .md
    var filePath = fileRoute + ".md";

    // Check if the file exists
    var stats;
    try {
        stats = pathutils.statSync(filePath);
    } catch (err) {
        expressresponse.send404(res);
        return;
    }

    // Get the template filepath
    var templatePath = pathutils.projectPathUnsafe(context.template);

    // Transform and get output HTML
    var html = transformer.process(templatePath, filePath);

    // Send response
    expressresponse.sendResponse(res, html);

};