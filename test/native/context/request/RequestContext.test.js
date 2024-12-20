const {RequestContext} = require("../../../../src/context/request/request-context");
const assert = require("assert")

describe("TestRequestContext", function () {

    it("parseRequestContext", function () {

        const url = "https://foo.com:10086/bar?k1=v1#1111";
        const ctx = RequestContext.parseRequestContext(url);
        assert.notEqual(ctx, null);

        assert.notEqual(ctx.rawUrl, null)
        assert.notEqual(ctx.rawUrl, "")

        assert.notEqual(ctx.hostname, null)
        assert.notEqual(ctx.hostname, "")

        assert.notEqual(ctx.host, null)
        assert.notEqual(ctx.host, "")

        assert.notEqual(ctx.port, null)
        assert.notEqual(ctx.port, "")

        assert.notEqual(ctx.path, null)
        assert.notEqual(ctx.path, "")

        assert.notEqual(ctx.params, null)
        assert.notEqual(ctx.params, "")

        assert.notEqual(ctx.hash, null)
        assert.notEqual(ctx.hash, "")

    });

});
