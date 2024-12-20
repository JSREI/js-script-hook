/**
 * 一次Script请求的上下文封装
 */
const {RequestContext} = require("../request/request-context");
const {ResponseContext} = require("../response/response-context");

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

    /**
     * 判断这个请求是否是jsonp请求
     *
     * @returns {boolean}
     */
    isJsonp() {
        return this.responseContext.isJsonpResponse() || this.requestContext.isJsonpRequest();
    }

}

module.exports = {
    ScriptContext
}
