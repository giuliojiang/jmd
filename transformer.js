var fs = require("fs");
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
var showdown = require("showdown");
converter = new showdown.Converter();
var pathutils = require("./pathutils.js");

module.exports.process = function(templatePath, mdPath) {

    var templateString;
    try {
        templateString = pathutils.readFileString(templatePath);
    } catch (err) {
        return "";
    }
    var templateDom = new JSDOM(templateString);

    // Find the replacing element
    var targetElement = templateDom.window.document.getElementById("jmd_content");

    // Open the MD file
    var mdString;
    try {
        mdString = pathutils.readFileString(mdPath);
    } catch (err) {
        return "";
    }

    // Parse MD file
    var compiledMD = converter.makeHtml(mdString);
    targetElement.innerHTML = compiledMD;

    // Get modified document
    var outputDocumentString = templateDom.serialize();
    return outputDocumentString;

};