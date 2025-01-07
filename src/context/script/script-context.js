/**
 * 封装一次 Script 请求的上下文，包含请求和响应的相关信息。
 */
const {randomId} = require("../../utils/id-util");

class ScriptContext {

    /**
     * 构造函数，创建一个 ScriptContext 实例。
     *
     * @param {string} url - 请求的 URL。
     * @param {RequestContext} requestContext - 请求上下文，包含请求的详细信息。
     * @param {ResponseContext} responseContext - 响应上下文，包含响应的详细信息。
     */
    constructor(url, requestContext, responseContext) {
        // 生成唯一的请求 ID
        this.requestId = "js-script-hook-" + randomId();
        this.url = url;
        this.requestContext = requestContext;
        this.responseContext = responseContext;
    }

    /**
     * 判断此请求是否是 JSONP 请求。
     *
     * @returns {boolean} - 如果是 JSONP 请求则返回 true，否则返回 false。
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
     * 判断此请求是否是 .js 文件请求。
     *
     * @return {boolean} - 如果请求的路径以 .js 结尾则返回 true，否则返回 false。
     */
    isJsSuffixRequest() {
        return this.requestContext && this.requestContext.isJsSuffixRequest();
    }

    /**
     * 将 Script 上下文转换为方便人类阅读的格式。
     *
     * @return {string} - 返回格式化后的字符串。
     */
    toHumanReadable() {
        const msgs = [];

        if (this.requestContext) {
            msgs.push("Request Information: ");
            msgs.push(this.requestContext.toHumanReadable(4));
        }

        msgs.push("\n\n");

        if (this.responseContext) {
            msgs.push("Response Information: ");
            msgs.push(this.responseContext.toHumanReadable());
        }

        return msgs.join("\n\n");
    }

}

module.exports = {
    ScriptContext
};