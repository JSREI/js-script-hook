/**
 * 表示一个Script类型的请求的响应
 */
class ResponseContext {

    /**
     *
     * @param responseJsCode 脚本原始的响应代码是什么
     * @param jsonpCallbackArguments 如果是jsonp类型的请求，捕捉到的响应是什么
     */
    constructor(responseJsCode, jsonpCallbackArguments) {
        this.responseJsCode = responseJsCode;
        this.jsonpCallbackArguments = jsonpCallbackArguments;
    }

    /**
     *
     * @param script {HTMLScriptElement}
     */
    static parseResponseContext(script) {
        const responseJsCode = script.text;
        return new ResponseContext(responseJsCode);
    }

    isJsonpResponse() {
        return !!this.jsonpCallbackArguments;
    }

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
}
