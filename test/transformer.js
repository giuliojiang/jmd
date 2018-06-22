var assert = require("assert");
var transformer = require("./../transformer.js");
var path = require("path");
var fs = require("fs");
var sinon = require("sinon");
var pathutils = require("./../pathutils.js");
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
var chai = require("chai");
var expect = chai.expect;

var rootDir = path.dirname(__dirname);

describe("transformer.js", function() {

    var sandbox;

    beforeEach(function() {
        sandbox = sinon.createSandbox();
    });

    afterEach(function() {
        sandbox.restore();
    })

    it("returns empty with invalid file paths", function() {
        sandbox.stub(pathutils, "readFileString").callsFake(function(fpath) {
            throw "File does not exist";
        })

        assert.equal(
            transformer.process("", "faser"),
            ""
        );
    });

    it("processes correct files", function() {
        var pathutilsReadFileString = pathutils.readFileString;
        sandbox.stub(pathutils, "readFileString").callsFake(function(fpath) {
            if (fpath == "path1") {
                return pathutilsReadFileString(path.join(rootDir, "etc", "template.html"));
            } else if (fpath == "path2") {
                return pathutilsReadFileString(path.join(rootDir, "etc", "www", "index.md"));
            } else {
                throw "Not stubbed ["+ fpath +"]";
            }
        });

        var output = transformer.process("path1", "path2");
        var contained = output.indexOf("Hello World") > -1;
        assert.equal(contained, true);

        var dom = new JSDOM(output);
        var title = dom.window.document.title;
        expect(title).to.equal("Hello World");

    });

    it("returns empty when MD file does not exist", function() {
        var pathutilsReadFileString = pathutils.readFileString;
        sandbox.stub(pathutils, "readFileString").callsFake(function(fpath) {
            if (fpath == "path1") {
                return pathutilsReadFileString(path.join(rootDir, "etc", "template.html"));
            } else {
                throw "Not stubbed ["+ fpath +"]";
            }
        });

        var output = transformer.process("path1", "faser");
        assert.deepEqual(output, "");
    });

    it("returns empty when HTML template malformed", function() {
        var pathutilsReadFileString = pathutils.readFileString;
        sandbox.stub(pathutils, "readFileString").callsFake(function(fpath) {
            if (fpath == "path1") { // HTML
                return "fosijfop j<htm??>ml> fjij?j </thmL.M> javascript\nrubbish\nfaser";
            } else if (fpath == "path2") {
                return pathutilsReadFileString(path.join(rootDir, "etc", "www", "index.md"));
            } else {
                throw "Not stubbed ["+ fpath +"]";
            }
        });

        var output = transformer.process("path1", "path2");
        assert.deepEqual(output, "");
    });

});
