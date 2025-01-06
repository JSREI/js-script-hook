const {getGlobalConfig} = require("../config/config");
const {getUnsafeWindow} = require("../utils/scope-util");
const {ObjectFunctionHook} = require("../hook/object-function-hook");
const {ResponseFormatter} = require("../formatter/response-formatter");
const {ResponseContext} = require("../context/response/response-context");

class DebuggerTester {

    /**
     *
     * 测试是否命中断点
     *
     * @param globalConfig
     * @param debuggerConfig
     * @param scriptContext {ScriptContext}
     * @return {boolean}
     */
    test(globalConfig, debuggerConfig, scriptContext) {

        // 首先URL要能够匹配得上
        if (!this.testUrlPattern(debuggerConfig.urlPatternType, debuggerConfig.urlPattern, scriptContext.url)) {
            return false;
        }

        // 支持忽略js文件请求
        if (globalConfig.isIgnoreJsSuffixRequest && scriptContext.isJsSuffixRequest()) {
            return false;
        }

        // 忽略不是jsonp的请求
        if (globalConfig.isIgnoreNotJsonpRequest && !scriptContext.isJsonp()) {
            return false;
        }

        // 请求断点
        if (debuggerConfig.enableRequestDebugger) {
            // 把一些相关的上下文赋值到变量方便断点命中这里的时候观察
            // _scriptContext中存放的是与当前的script请求相关的一些上下文信息
            const _scriptContext = scriptContext;
            const humanReadableScriptInformation = scriptContext.toHumanReadable()
            debugger;
        }

        return true;
    }

    // ---------------------------------------------------------------------------------------------------------------------

    /**
     * 测试请求的URL是否匹配
     *
     * @param urlPatternType 界面上配置的匹配类型
     * @param urlPattern 界面配置的匹配类型对应的值
     * @param url {String} 要测试匹配的URL
     * @return {boolean} 是否匹配得上
     */
    testUrlPattern(urlPatternType, urlPattern, url) {

        if (!url) {
            return false;
        }

        if (!urlPattern) {
            return true;
        }

        // if (typeof urlPattern === "string") {
        //     return urlPattern.indexOf(url) !== -1;
        // } else if (urlPattern instanceof RegExp) {
        //     return urlPattern.test(url);
        // } else {
        //     return false;
        // }

        switch (urlPatternType) {
            case "equals-string":
                return this.testUrlPatternForEquals(urlPattern, url);
            case "contains-string":
                return this.testUrlPatternForContains(urlPattern, url);
            case "match-regexp":
                return this.testUrlPatternForMatchRegexp(urlPattern, url);
            case "match-all":
                return this.testUrlPatternForMatchAll(urlPattern, url);
            default:
                return false;
        }

    }

    /**
     * 完全匹配
     *
     * @param urlPattern
     * @param url
     * @return {*}
     */
    testUrlPatternForEquals(urlPattern, url) {
        return url.equals(urlPattern);
    }

    /**
     * 包含给定的关键字
     *
     * @param urlPattern
     * @param url
     * @return {boolean}
     */
    testUrlPatternForContains(urlPattern, url) {
        return url.indexOf(urlPattern) !== -1;
    }

    /**
     * 正则表达式方式匹配
     *
     * @param urlPattern
     * @param url
     * @return {boolean}
     */
    testUrlPatternForMatchRegexp(urlPattern, url) {
        try {
            return new RegExp(urlPattern).test(url);
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * 直接匹配所有
     * @param urlPattern
     * @param url
     * @return {boolean}
     */
    testUrlPatternForMatchAll(urlPattern, url) {
        return true;
    }

    // ---------------------------------------------------------------------------------------------------------------------

    testForResponse(globalConfig, debuggerConfig, scriptContext) {

        // 首先URL要能够匹配得上
        if (!this.testUrlPattern(debuggerConfig.urlPatternType, debuggerConfig.urlPattern, scriptContext.url)) {
            return false;
        }

        // 支持忽略js文件请求
        if (globalConfig.isIgnoreJsSuffixRequest && scriptContext.isJsSuffixRequest()) {
            return false;
        }

        // 忽略不是jsonp的请求
        if (globalConfig.isIgnoreNotJsonpRequest && !scriptContext.isJsonp()) {
            return false;
        }

        // 请求断点
        if (debuggerConfig.enableResponseDebugger) {
            // 把一些相关的上下文赋值到变量方便断点命中这里的时候观察
            // _scriptContext中存放的是与当前的script请求相关的一些上下文信息
            const _scriptContext = scriptContext;
            const humanReadableScriptInformation = scriptContext.toHumanReadable()
            debugger;
        }

        return true;
    }

    /**
     * 判断是否需要打印到控制台上
     *
     * @param globalConfig
     * @param scriptContext
     * @return {boolean}
     */
    isNeedPrintToConsole(globalConfig, scriptContext) {

        // 忽略js文件请求
        if (globalConfig.isIgnoreJsSuffixRequest && scriptContext.isJsSuffixRequest()) {
            return false;
        }

        // 忽略不是jsonp的请求
        if (globalConfig.isIgnoreNotJsonpRequest && !scriptContext.isJsonp()) {
            return false;
        }

        return true;
    }

}

module.exports = {
    DebuggerTester
}

