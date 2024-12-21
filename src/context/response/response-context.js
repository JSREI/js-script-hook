/**
 * 表示一个Script类型的请求的响应
 */
class ResponseContext {

    constructor(responseJsCode) {
        this.responseJsCode = responseJsCode;
    }

    /**
     *
     * @param script {HTMLScriptElement}
     */
    static parseResponseContext(script) {
        const responseJsCode = script.text;
        return new ResponseContext(responseJsCode);
    }

    /**
     * 尝试从响应体中抽取出jsonp的callback函数名字
     *
     * @return {String}
     */
    parseJsonpCallbackFuncNameFromResponse() {

        // TODO 适配jQuery的callback，适配其它类型的callback函数

    }

    isJsonpResponse() {

    }

    toHumanReadable() {
        return "";
    }

}

module.exports = {
    ResponseContext
}
