var titleparser = require("./../titleparser.js");
var chai = require("chai");
var expect = chai.expect;

describe("titleparser.js", function() {

    describe("parseTitle", function() {

        it("returns empty string if invalid data", function() {

            var res = titleparser.parseTitle(9);
            expect(res).to.equal("");

        });

        it("returns empty string when there is no title", function() {

            var mdString = "hello world\nnotitle";
            var res = titleparser.parseTitle(mdString);
            expect(res).to.equal("");

        });

        it("returns title when title is present", function() {

            var mdString = "#hello world\nnotitle";
            var res = titleparser.parseTitle(mdString);
            expect(res).to.equal("hello world");

        });

        it("handles multiple spaces and hashes", function() {

            var mdString = "####       hello world\nnotitle";
            var res = titleparser.parseTitle(mdString);
            expect(res).to.equal("hello world");

        });

    });

});