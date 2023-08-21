import {ScriptContext} from "../context/script/ScriptContext";
import {ObjectFunctionHook} from "../hook/ObjectFunctionHook";
import {Global} from "../global/Global";
import {JsonpCallbackFunctionAnalyzer} from "../jsonp/JsonpCallbackFunctionAnalyzer";

/**
 * 表示一个条件断点
 */
class Debugger {

    /**
     * 创建一个断点
     *
     * @param urlPattern {String | RegExp} 用于与script类型的请求的URL做匹配进入断点
     * @param enableRequestDebugger {Boolean} 是否开启请求断点，开启请求断点会在请求发送之前进入断点
     * @param enableResponseDebugger {Boolean} 是否开启响应断点，开启响应断点会在响应处理之前进入断点
     * @param callbackFunctionParamName {String} 传递jsonp回调函数名字的参数，比如 "callback"
     */
    constructor(urlPattern, enableRequestDebugger, enableResponseDebugger, callbackFunctionParamName) {
        this.urlPattern = urlPattern;
        this.enableRequestDebugger = enableRequestDebugger;
        this.enableResponseDebugger = enableResponseDebugger;
        this.callbackFunctionParamName = callbackFunctionParamName;
    }

    /**
     *
     * 测试是否命中断点
     *
     * @param scriptContext {ScriptContext}
     */
    test(scriptContext) {

        // 首先URL要能够匹配得上
        if (!this.testUrlPattern(scriptContext.URL)) {
            return;
        }

        // 请求断点
        if (this.enableRequestDebugger) {
            debugger;
        }

        // 响应断点
        if (this.enableResponseDebugger) {

            // 如果没有指定jsonp函数的名字的话，则尝试自动抽取函数名字
            if (!this.callbackFunctionParamName) {
                this.callbackFunctionParamName = new JsonpCallbackFunctionAnalyzer().parseScriptContext(scriptContext);
            }
            if (!this.callbackFunctionParamName) {
                // TODO 2023-8-22 01:00:27 完善错误提示信息
                throw new Error("must give me jsonp function param name, example: callback");
            }

            // 为响应体中的回调函数增加hook
            new ObjectFunctionHook(Global.getWindow(), this.callbackFunctionParamName).addHook();
        }

    }

    /**
     * 测试请求的URL是否匹配
     *
     * @param url {String} 要测试匹配的URL
     * @return {boolean} 是否匹配得上
     */
    testUrlPattern(url) {

        if (!url) {
            return false;
        }

        if (!this.urlPattern) {
            return true;
        }

        if (typeof this.urlPattern === "string") {
            return this.urlPattern.indexOf(url) !== -1;
        } else if (this.urlPattern instanceof RegExp) {
            return this.urlPattern.test(url);
        } else {
            return false;
        }

    }

}

module.exports = {
    Debugger
}
