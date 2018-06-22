

module.exports.isString = function(s) {
    if (!s) {
        return false;
    }

    return (typeof s) == "string";
};