/**
 * 一次Script请求的上下文封装
 */
const {RequestContext} = require("../request/request-context");
const {ResponseContext} = require("../response/response-context");
const {randomId} = require("../../utils/id-util");

class ScriptContext {

    /**
     * script级别的上下文
     *
     * @param url {String}
     * @param requestContext {RequestContext}
     * @param responseContext {ResponseContext}
     */
    constructor(url, requestContext, responseContext) {
        this.requestId = "js-script-hook-" + randomId();
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
        if (this.requestContext && this.requestContext.isJsonpRequest()) {
            return true;
        }
        if (this.responseContext && this.responseContext.isJsonpResponse()) {
            return true;
        }
        return false;
    }

    /**
     * 判断是否是请求的js文件
     *
     * @return {""|boolean}
     */
    isJsSuffixRequest() {
        return this.requestContext && this.requestContext.isJsSuffixRequest();
    }

    /**
     *
     * @return {string}
     */
    toHumanReadable() {

        const msgs = [];

        if (this.requestContext) {
            msgs.push("Request Information: ");
            msgs.push(this.requestContext.toHumanReadable(4));
        }

        msgs.push("\n\n");

        if (this.responseContext) {
            msgs.push("Response Information: ")
            msgs.push(this.responseContext.toHumanReadable(4));
        }

        return msgs.join("\n\n");
    }

}

module.exports = {
    ScriptContext
}
