var assert = require("assert");
var sinon = require("sinon");
var path = require("path");

var pathutils = require("./../pathutils.js");

describe("pathutils.js", function() {

    describe("projectPathUnsafe", function() {

        it("returns input when absolute path", function() {
            var inpath = "/home/gj/test.txt";
            var res = pathutils.projectPathUnsafe(inpath);

            assert.deepEqual(
                res,
                "/home/gj/test.txt"
            );
        });

        it("returns relative path when not absolute", function() {
            var inpath = "www/etc/config";
            var res = pathutils.projectPathUnsafe(inpath);

            var rootDir = path.dirname(__dirname);
            var expected = path.join(rootDir, inpath);
            assert.deepEqual(
                res,
                expected
            );
        });

    });

    describe("projectPathSafe", function() {

        it("returns empty when path is absolute", function() {
            var inpath = "/home/gj/test";
            var res = pathutils.projectPathSafe(inpath);

            assert.deepEqual(
                res,
                ""
            );
        });

        it("returns path when path is relative", function() {
            var inpath = "www/etc/config";
            var res = pathutils.projectPathSafe(inpath);

            var rootDir = path.dirname(__dirname);
            var expected = path.join(rootDir, inpath);
            assert.deepEqual(
                res,
                expected
            );
        });

    });

});