const {Param} = require("../../../../src/context/request/param");
const assert = require("assert")

describe("TestRequestParam", function () {

    it("new", function () {
        const param = new Param();
        assert.notEqual(param, null);
    });

});
