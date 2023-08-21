/**
 * 用于解析jsonp
 */
class JsonpCallbackFunctionAnalyzer {

    /**
     * 从一次完整的请求中分析
     *
     * @param scriptContext {ScriptContext}
     */
    parseScriptContext(scriptContext) {

        // 1. 如果请求和响应都有，则尝试对照请求和响应来识别

        // 1. 是jsonp类型的地址

        // 2. 分析参数，判断哪个参数是最有可能是jsonp回调的函数名称

        // 3. 同时结合响应进行判断（比如某个参数在响应中出现过）

        // 某个参数的历史值很相似，比如有相同的前缀和后缀

        // 匹配常见的框架的发送jsonp的形式

    }

}

module.exports = {
    JsonpCallbackFunctionAnalyzer
}

