/**
 * 表示一个Script类型的请求的响应
 */
class ResponseContext {

    constructor(responseJsCode) {
        this.responseJsCode = responseJsCode;
    }

    /**
     *
     * @param script
     */
    static parseResponseContext(script) {
        const responseJsCode = script.text;
        return new ResponseContext(responseJsCode);
    }

    /**
     * 尝试从响应体中抽取出jsonp的callback函数名字
     * @return {String}
     */
    parseJsonpCallbackFuncNameFromResponse() {
        // TODO
    }

}

module.exports = {
    ResponseContext
}
