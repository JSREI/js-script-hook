const {getGlobalConfig} = require("../config/config");
const {getUnsafeWindow} = require("../utils/scope-util");
const {ObjectFunctionHook} = require("../hook/object-function-hook");

class DebuggerTester {

    /**
     *
     * 测试是否命中断点
     *
     * @param globalConfig
     * @param debuggerInformation
     * @param scriptContext {ScriptContext}
     */
    test(globalConfig, debuggerInformation, scriptContext) {

        // 首先URL要能够匹配得上
        if (!this.testUrlPattern(debuggerInformation.urlPattern, scriptContext.url)) {
            return;
        }

        // 支持忽略js文件请求
        if (globalConfig.isIgnoreJsSuffixRequest && scriptContext.isJsSuffixRequest()) {
            return;
        }

        // 忽略不是jsonp的请求
        if (globalConfig.isIgnoreNotJsonpRequest && !scriptContext.isJsonp()) {
            return;
        }

        // 请求断点
        if (debuggerInformation.enableRequestDebugger) {
            // 把一些相关的上下文赋值到变量方便断点命中这里的时候观察
            // _scriptContext中存放的是与当前的script请求相关的一些上下文信息
            const _scriptContext = scriptContext;
            const humanReadableScriptInformation = scriptContext.toHumanReadable()
            console.log(humanReadableScriptInformation);
            debugger;
        }

        // 响应断点
        if (debuggerInformation.enableResponseDebugger) {

            // 如果没有指定jsonp函数的名字的话，则尝试自动抽取函数名字
            let jsonpCallbackFunctionName = debuggerInformation.callbackFunctionParamName;
            if (!jsonpCallbackFunctionName) {
                jsonpCallbackFunctionName = scriptContext.requestContext.getJsonpCallbackFuncName();
            }
            if (!jsonpCallbackFunctionName) {
                // TODO 2023-8-22 01:00:27 完善错误提示信息
                // throw new Error("must give me analyzer function param name, example: callback");
                console.error("Could not parse jsonp callback function", jsonpCallbackFunctionName);
                return;
            }

            // 为响应体中的回调函数增加hook
            const jsonpCallbackFunction = getUnsafeWindow()[jsonpCallbackFunctionName];
            if (!jsonpCallbackFunction) {
                // TODO 2024-12-20 23:08:29 错误处理
                return;
            }
            // 跟进去这个 jsonpCallbackFunction 函数的代码位置就是jsonp的回调函数的逻辑，也是处理响应的逻辑
            new ObjectFunctionHook(getUnsafeWindow(), jsonpCallbackFunctionName).addHook(function () {
                // 这里是脚本的响应断点，已经拦截到响应，跟进去holder函数就行了
                console.log(jsonpCallbackFunctionName);
                debugger;
            });
        }

    }

    /**
     * 测试请求的URL是否匹配
     *
     * @param urlPattern
     * @param url {String} 要测试匹配的URL
     * @return {boolean} 是否匹配得上
     */
    testUrlPattern(urlPattern, url) {

        if (!url) {
            return false;
        }

        if (!urlPattern) {
            return true;
        }

        if (typeof urlPattern === "string") {
            return urlPattern.indexOf(url) !== -1;
        } else if (urlPattern instanceof RegExp) {
            return urlPattern.test(url);
        } else {
            return false;
        }

    }

}

module.exports = {
    DebuggerTester
}

