var sinon = require("sinon");
var chai = require("chai");
var assert = require("assert");
var appgetroute = require("./../appgetroute.js");
var expressresponse = require("./../expressresponse.js");
var pathutils = require("./../pathutils.js");
var transformer = require("./../transformer.js");

var expect = chai.expect;

describe("appgetroute.js", function() {

    var d = {};
    var fakes = {};

    beforeEach(function() {

        d.context = {
            www: "some/www/path",
            template: "some/template/path.html"
        };

        d.res = {};

        d.req = {
            baseUrl: "/blog",
            url: "/"
        };

        fakes.expressresponse = {};
        
        fakes.expressresponse.send404 = sinon.fake();
        sinon.replace(expressresponse, "send404", fakes.expressresponse.send404);

        fakes.expressresponse.sendResponse = sinon.fake();
        sinon.replace(expressresponse, "sendResponse", fakes.expressresponse.sendResponse);

        fakes.expressresponse.sendFile = sinon.fake();
        sinon.replace(expressresponse, "sendFile", fakes.expressresponse.sendFile);

        fakes.appgetroute = {};

        fakes.pathutils = {};

        fakes.transformer = {};

    });

    afterEach(function() {
        
        sinon.restore();
        d = {};
        fakes = {};

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

        it("does nothing with null context", function() {

            var context = null;
            var routePath = "index";
            var res = null;

            expect(function() {
                appgetroute.handleGet(context, d.req, routePath, res)
            }).to.throw();

        });

        it("sends 404 with invalid path", function() {
            
            appgetroute.handleGet(d.context, d.req, ["this is not a string"], d.res);

            expect(fakes.expressresponse.send404.called).to.be.true;

        });

        it("sends 404 with null path", function() {

            appgetroute.handleGet(d.context, d.req, null, d.res);

            expect(fakes.expressresponse.send404.called).to.be.true;

        });

        it("redirects to index page when path is empty", function() {

            // With empty path, we get just the target www directory
            fakes.pathutils.statSync = sinon.fake(function(filepath) {
                var res = {};
                res.isDirectory = function() {
                    return true;
                };
                return res;
            });
            sinon.replace(pathutils, "statSync", fakes.pathutils.statSync);

            // Mock redirect
            fakes.expressresponse.redirect = sinon.fake();
            sinon.replace(expressresponse, "redirect", fakes.expressresponse.redirect);

            // We don't want handlePage to be called
            fakes.appgetroute.handlePage = sinon.fake();
            sinon.replace(appgetroute, "handlePage", fakes.appgetroute.handlePage);

            var req = {
                baseUrl: "/blog",
                url: ""
            };
            appgetroute.handleGet(d.context, req, "", d.res);

            var redirectArgs = fakes.expressresponse.redirect.getCall(0).args;
            console.info("redirectargs are " + JSON.stringify(redirectArgs));
            expect(fakes.appgetroute.handlePage.called).to.be.false;

        });

        it("attempts to handle the file when file does not exist", function() {

            fakes.pathutils.statSync = sinon.fake(function(filePath) {
                throw Error("File does not exist");
            });
            sinon.replace(pathutils, "statSync", fakes.pathutils.statSync);

            fakes.appgetroute.handlePage = sinon.fake();
            sinon.replace(appgetroute, "handlePage", fakes.appgetroute.handlePage);

            appgetroute.handleGet(d.context, d.req, "somefile", d.res);

            var callargs = fakes.appgetroute.handlePage.getCall(0).args;
            var argfileroute = callargs[1];
            expect(argfileroute).to.deep.equal("some/www/path/somefile");

        });

        it("sends raw file if file exists", function() {

            fakes.pathutils.statSync = sinon.fake(function(filePath) {
                var res = {};
                res.isDirectory = function() {
                    return false;
                };
                res.isFile = function() {
                    return true;
                };
                return res;
            });
            sinon.replace(pathutils, "statSync", fakes.pathutils.statSync);

            var routePath = "lib/somelib.js";
            var output = appgetroute.handleGet(d.context, d.req, routePath, d.res);

            expect(fakes.expressresponse.sendFile.called).to.be.true;

        });

    });

    describe("handlePage", function() {

        it("appends .md to the input path", function() {

            fakes.pathutils.statSync = sinon.fake();
            sinon.replace(pathutils, "statSync", fakes.pathutils.statSync);

            var fileRoute = "blog/page1";

            appgetroute.handlePage(d.context, fileRoute, d.res);

            var args = fakes.pathutils.statSync.getCall(0).args;
            expect(args[0]).to.deep.equal("blog/page1.md");

        });

        it("sends processed markdown data", function() {

            fakes.transformer.process = sinon.fake(function() {
                return "Some processed data";
            });
            sinon.replace(transformer, "process", fakes.transformer.process);

            fakes.pathutils.statSync = sinon.fake(function() {
                return {};
            });
            sinon.replace(pathutils, "statSync", fakes.pathutils.statSync);

            d.context.template = "/var/template.html";

            var fileRoute = "/var/www/index";

            appgetroute.handlePage(d.context, fileRoute, d.res);

            var processArgs = fakes.transformer.process.getCall(0).args;
            expect(processArgs[0]).to.deep.equal("/var/template.html");
            expect(processArgs[1]).to.deep.equal("/var/www/index.md");

            var sendResponseArgs = fakes.expressresponse.sendResponse.getCall(0).args;
            expect(sendResponseArgs[1]).to.deep.equal("Some processed data");

        });

        it("sends 404 if page does not exist", function() {

            fakes.pathutils.statSync = sinon.fake(function() {
                throw Error("Mock: this file does not exist");
            });
            sinon.replace(pathutils, "statSync", fakes.pathutils.statSync);

            appgetroute.handlePage(d.context, "index", d.res);

            expect(fakes.expressresponse.send404.called).to.be.true;

        });

    });

});