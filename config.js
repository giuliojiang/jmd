var pathutils = require("./pathutils.js");

module.exports.setData = function(context, data) {
    
    context.template = pathutils.projectPathUnsafe(data.template);
    context.www = pathutils.projectPathUnsafe(data.www);

};