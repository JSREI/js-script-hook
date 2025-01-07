/**
 * 表示一个 Script 类型请求的响应，包含响应的 JavaScript 代码或 JSONP 回调参数。
 */
class ResponseContext {

    /**
     * 构造函数，创建一个 ResponseContext 实例。
     *
     * @param {string} responseJsCode - 脚本原始的响应代码。
     * @param {Array|null} [jsonpCallbackArguments=null] - 如果是 JSONP 类型的请求，捕捉到的响应参数。
     */
    constructor(responseJsCode, jsonpCallbackArguments = null) {
        this.responseJsCode = responseJsCode;
        this.jsonpCallbackArguments = jsonpCallbackArguments;
    }

    /**
     * 从 HTMLScriptElement 解析响应上下文。
     *
     * @param {HTMLScriptElement} script - 包含响应代码的 script 元素。
     * @return {ResponseContext} - 返回解析好的响应上下文。
     */
    static parseResponseContext(script) {
        const responseJsCode = script.text;
        return new ResponseContext(responseJsCode);
    }

    /**
     * 判断此响应是否是 JSONP 类型的响应。
     *
     * @return {boolean} - 如果是 JSONP 响应则返回 true，否则返回 false。
     */
    isJsonpResponse() {
        return !!this.jsonpCallbackArguments;
    }

    /**
     * 将响应上下文转换为方便人类阅读的格式。
     *
     * @return {string} - 返回格式化后的字符串。
     */
    toHumanReadable() {
        const msgs = [];
        if (this.isJsonpResponse()) {
            msgs.push("jsonp callback payload: ");
            msgs.push(JSON.stringify(this.jsonpCallbackArguments, null, 4));
        } else {
            msgs.push("javascript code: ");
            msgs.push(this.responseJsCode);
        }
        return msgs.join("\n");
    }

}

module.exports = {
    ResponseContext
};