/**
 * 用于测试是否命中断点的工具类，支持对请求和响应的断点测试。
 */
class DebuggerTester {

    /**
     * 测试是否命中断点。
     *
     * @param {Object} globalConfig - 全局配置对象，包含断点的全局设置。
     * @param {Object} debuggerConfig - 断点配置对象，包含断点的具体设置。
     * @param {ScriptContext} scriptContext - 脚本上下文对象，包含请求和响应的详细信息。
     * @return {boolean} - 如果命中断点则返回 true，否则返回 false。
     */
    test(globalConfig, debuggerConfig, scriptContext) {

        // 首先 URL 要能够匹配得上
        if (!this.testUrlPattern(debuggerConfig.urlPatternType, debuggerConfig.urlPattern, scriptContext.url)) {
            return false;
        }

        // 支持忽略 .js 文件请求
        if (globalConfig.isIgnoreJsSuffixRequest && scriptContext.isJsSuffixRequest()) {
            return false;
        }

        // 忽略不是 JSONP 的请求
        if (globalConfig.isIgnoreNotJsonpRequest && !scriptContext.isJsonp()) {
            return false;
        }

        // 请求断点
        if (debuggerConfig.enableRequestDebugger) {
            // 把一些相关的上下文赋值到变量方便断点命中这里的时候观察
            // _scriptContext 中存放的是与当前的 script 请求相关的一些上下文信息
            const _scriptContext = scriptContext;
            const humanReadableScriptInformation = scriptContext.toHumanReadable();
            debugger; // 断点调试
        }

        return true;
    }

    // ---------------------------------------------------------------------------------------------------------------------

    /**
     * 测试请求的 URL 是否匹配断点的 URL 模式。
     *
     * @param {string} urlPatternType - URL 匹配模式类型（例如："equals-string"、"contains-string" 等）。
     * @param {string | RegExp} urlPattern - URL 匹配模式的值。
     * @param {string} url - 要测试匹配的 URL。
     * @return {boolean} - 如果 URL 匹配模式则返回 true，否则返回 false。
     */
    testUrlPattern(urlPatternType, urlPattern, url) {

        if (!url) {
            return false;
        }

        if (!urlPattern) {
            return true;
        }

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
     * 测试 URL 是否完全匹配给定的模式。
     *
     * @param {string} urlPattern - 要匹配的 URL 模式。
     * @param {string} url - 要测试的 URL。
     * @return {boolean} - 如果 URL 完全匹配模式则返回 true，否则返回 false。
     */
    testUrlPatternForEquals(urlPattern, url) {
        return url === urlPattern;
    }

    /**
     * 测试 URL 是否包含给定的关键字。
     *
     * @param {string} urlPattern - 要匹配的关键字。
     * @param {string} url - 要测试的 URL。
     * @return {boolean} - 如果 URL 包含关键字则返回 true，否则返回 false。
     */
    testUrlPatternForContains(urlPattern, url) {
        return url.indexOf(urlPattern) !== -1;
    }

    /**
     * 测试 URL 是否匹配给定的正则表达式。
     *
     * @param {string} urlPattern - 要匹配的正则表达式。
     * @param {string} url - 要测试的 URL。
     * @return {boolean} - 如果 URL 匹配正则表达式则返回 true，否则返回 false。
     */
    testUrlPatternForMatchRegexp(urlPattern, url) {
        try {
            return new RegExp(urlPattern).test(url);
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    /**
     * 匹配所有 URL（始终返回 true）。
     *
     * @param {string} urlPattern - 忽略此参数。
     * @param {string} url - 忽略此参数。
     * @return {boolean} - 始终返回 true。
     */
    testUrlPatternForMatchAll(urlPattern, url) {
        return true;
    }

    // ---------------------------------------------------------------------------------------------------------------------

    /**
     * 测试响应是否命中断点。
     *
     * @param {Object} globalConfig - 全局配置对象，包含断点的全局设置。
     * @param {Object} debuggerConfig - 断点配置对象，包含断点的具体设置。
     * @param {ScriptContext} scriptContext - 脚本上下文对象，包含请求和响应的详细信息。
     * @return {boolean} - 如果命中断点则返回 true，否则返回 false。
     */
    testForResponse(globalConfig, debuggerConfig, scriptContext) {

        // 首先 URL 要能够匹配得上
        if (!this.testUrlPattern(debuggerConfig.urlPatternType, debuggerConfig.urlPattern, scriptContext.url)) {
            return false;
        }

        // 支持忽略 .js 文件请求
        if (globalConfig.isIgnoreJsSuffixRequest && scriptContext.isJsSuffixRequest()) {
            return false;
        }

        // 忽略不是 JSONP 的请求
        if (globalConfig.isIgnoreNotJsonpRequest && !scriptContext.isJsonp()) {
            return false;
        }

        // 响应断点是否开启
        return debuggerConfig.enableResponseDebugger;
    }

    /**
     * 判断是否需要将信息打印到控制台。
     *
     * @param {Object} globalConfig - 全局配置对象，包含断点的全局设置。
     * @param {ScriptContext} scriptContext - 脚本上下文对象，包含请求和响应的详细信息。
     * @return {boolean} - 如果需要打印到控制台则返回 true，否则返回 false。
     */
    isNeedPrintToConsole(globalConfig, scriptContext) {

        // 忽略 .js 文件请求
        if (globalConfig.isIgnoreJsSuffixRequest && scriptContext.isJsSuffixRequest()) {
            return false;
        }

        // 忽略不是 JSONP 的请求
        if (globalConfig.isIgnoreNotJsonpRequest && !scriptContext.isJsonp()) {
            return false;
        }

        return true;
    }

}

module.exports = {
    DebuggerTester
};