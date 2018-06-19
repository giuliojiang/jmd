

module.exports.send404 = function(res, message) {
    if (!message) {
        message = "Not found";
    }
    res.status(404).send(message);
};

module.exports.sendResponse = function(res, text) {
    res.send(text);
};

module.exports.sendFile = function(res, filepath) {
    res.sendFile(filepath);
};