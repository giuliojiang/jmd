var sinon = require("sinon");
var chai = require("chai");
var assert = require("assert");
var appgetroute = require("./../appgetroute.js");
var expressresponse = require("./../expressresponse.js");
var pathutils = require("./../pathutils.js");

var expect = chai.expect;

describe("appgetroute.js", function() {

    afterEach(function() {
        sinon.restore();
    });

    describe("sanitizePath", function() {

        it("removes double slahses", function() {

            var inputpath = "pages//thepage";
            var output = appgetroute.sanitizePath(inputpath);

            assert.deepEqual(
                output,
                "pages/thepage"
            );

        });

        it("rejects absolute paths", function() {

            var inputpath = "/thepage//thepage";
            var output = appgetroute.sanitizePath(inputpath);

            assert.deepEqual(
                output, 
                ""
            );

        });

        it("removes parent path", function() {
            
            var inputpath = "../../../../../../home";
            var output = appgetroute.sanitizePath(inputpath);

            assert.deepEqual(
                output,
                ""
            );

        });

    });

    describe("handleGet", function() {

        var fakes = {};
        var d = {};

        beforeEach(function() {

            d.context = {
                www: "some/www/path",
                template: "some/template/path.html"
            };

            d.res = {};

            fakes.expressresponse = {};
            
            fakes.expressresponse.send404 = sinon.fake();
            sinon.replace(expressresponse, "send404", fakes.expressresponse.send404);

            fakes.expressresponse.sendResponse = sinon.fake();
            sinon.replace(expressresponse, "sendResponse", fakes.expressresponse.sendResponse);

            fakes.expressresponse.sendFile = sinon.fake();
            sinon.replace(expressresponse, "sendFile", fakes.expressresponse.sendFile);

        });

        afterEach(function() {

            fakes = {};
            d = {};

            sinon.restore();
        
        });

        it("does nothing with null context", function() {

            var context = null;
            var routePath = "index";
            var res = null;

            expect(function() {
                appgetroute.handleGet(context, routePath, res)
            }).to.throw();

        });

        it("sends 404 with invalid path", function() {
            
            appgetroute.handleGet(d.context, ["this is not a string"], d.res);

            expect(fakes.expressresponse.send404.called).to.be.true;

        });

        it("sends 404 with null path", function() {

            appgetroute.handleGet(d.context, null, d.res);

            expect(fakes.expressresponse.send404.called).to.be.true;

        });

        it("handles index page when path is empty", function() {

            fakes.pathutils = {};
            fakes.appgetroute = {};
            
            // With empty path, we get just the target www directory
            fakes.pathutils.statSync = sinon.fake(function(filepath) {
                var res = {};
                res.isDirectory = function() {
                    return true;
                };
                return res;
            });
            sinon.replace(pathutils, "statSync", fakes.pathutils.statSync);

            // We want handleDirectory to be called
            fakes.appgetroute.handleDirectory = sinon.fake();
            sinon.replace(appgetroute, "handleDirectory", fakes.appgetroute.handleDirectory);

            // We don't want handleFile to be called
            fakes.appgetroute.handleFile = sinon.fake();
            sinon.replace(appgetroute, "handleFile", fakes.appgetroute.handleFile);

            appgetroute.handleGet(d.context, "", d.res);

            expect(fakes.appgetroute.handleDirectory.called).to.be.true;
            expect(fakes.appgetroute.handleFile.called).to.be.false;

        });

        it("attempts to handle the file when file does not exist", function() {

            fakes.pathutils = {};
            fakes.appgetroute = {};

            fakes.pathutils.statSync = sinon.fake(function(filePath) {
                throw Error("File does not exist");
            });
            sinon.replace(pathutils, "statSync", fakes.pathutils.statSync);

            fakes.appgetroute.handleFile = sinon.fake();
            sinon.replace(appgetroute, "handleFile", fakes.appgetroute.handleFile);

            appgetroute.handleGet(d.context, "somefile", d.res);

            var callargs = fakes.appgetroute.handleFile.getCall(0).args;
            var argfileroute = callargs[1];
            expect(argfileroute).to.deep.equal("some/www/path/somefile");

        });

    });

});