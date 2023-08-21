const {Param} = require("../../../src/context/request/Param");
const assert = require("assert")

describe("TestRequestParam", function () {

    it("new", function () {
        const param = new Param();
        assert.notEqual(param, null);
    });

});
