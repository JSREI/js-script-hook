/**
 * 一次Script请求的上下文封装
 */
const {RequestContext} = require("../request/RequestContext");
const {ResponseContext} = require("../response/ResponseContext");

class ScriptContext {


    /**
     * script级别的上下文
     *
     * @param url {String}
     * @param requestContext {RequestContext}
     * @param responseContext {ResponseContext}
     */
    constructor(url, requestContext, responseContext) {
        this.url = url;
        this.requestContext = requestContext;
        this.responseContext = responseContext;
    }

}

module.exports = {
    ScriptContext
}
