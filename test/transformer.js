var assert = require("assert");
var transformer = require("./../transformer.js");
var path = require("path");
var fs = require("fs");
var sinon = require("sinon");
var pathutils = require("./../pathutils.js");

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

    });

    // TODO
    // MD file not exists
    // HTML malformed
    // MD malformed

});




// // in your testfile
// var innerLib  = require('./path/to/innerLib');
// var underTest = require('./path/to/underTest');
// var sinon     = require('sinon');

// describe("underTest", function() {
//   it("does something", function() {
//     sinon.stub(innerLib, 'toCrazyCrap', function() {
//       // whatever you would like innerLib.toCrazyCrap to do under test
//     });

//     underTest();

//     sinon.assert.calledOnce(innerLib.toCrazyCrap); // sinon assertion

//     innerLib.toCrazyCrap.restore(); // restore original functionality
//   });
// });
