const {getGlobalConfig} = require("../config/config");
const {getUnsafeWindow} = require("../utils/scope-util");
const {ObjectFunctionHook} = require("../hook/object-function-hook");

class DebuggerTester {

    /**
     *
     * 测试是否命中断点
     *
     * @param globalConfig
     * @param debuggerConfig
     * @param scriptContext {ScriptContext}
     */
    test(globalConfig, debuggerConfig, scriptContext) {

        // 首先URL要能够匹配得上
        if (!this.testUrlPattern(debuggerConfig.urlPatternType, debuggerConfig.urlPattern, scriptContext.url)) {
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
        if (debuggerConfig.enableRequestDebugger) {
            // 把一些相关的上下文赋值到变量方便断点命中这里的时候观察
            // _scriptContext中存放的是与当前的script请求相关的一些上下文信息
            const _scriptContext = scriptContext;
            const humanReadableScriptInformation = scriptContext.toHumanReadable()
            console.log(humanReadableScriptInformation);
            // Example Output:
            // "Request Information:
            //
            //     hostname: gcaptcha4.geetest.com
            //
            //     path: /verify
            //
            //     params:
            //
            //         callback = geetest_1736090943102    <---- this param is jsonp callback function name
            //
            //         captcha_id = ada5349b1590bc08b1bed97596609199
            //
            //         client_type = web
            //
            //         lot_number = e5e95b5b2b8940e6bb6968695d9eda95
            //
            //         payload = AgFD8gWUUuHFx-XvpP7J2WzfgGoulbh3scPkfDrN7Ls-13ySGq_ISPvhk7HFpeI8B148K8UQEDx2jB_Fb7lAxAAgR9oVUofnxqYMuoaa1PYovz2fsXmG5FNyu8oMp8XSMK6zRUMqty7ZeYItsGJNMd2FW6DcZUb7R5OGAkWna2dxl3YboMMkz3g6VLgoLMjgRHEQIUIfi87jpgBZ-R7roQp3rkW0d8ja2Xtr20rNHx1TjjvkCzIrgfRjebptQ7yEuGj76kL1QPnUGbhZo4BfVTBeEC2w9O2-QUdtJfPZMnUnwWnVUsDMvqo_wzygw739JwxRGpbao3DmXCAJtIKjQvTUS3B4-_ecSFIRmk8jcruJ_g60QAOqeZ5KNCMNXWsqLbGQ3bJb7gwssZO6fytpzYq4qHoBq7e0cOrnOJ0ZaLsGtVPYJo8gfKVKQvsWSdWJcVBWoqkRS5-J7g338FaHXxA-VFJ4MxTLHVjiucGm5Trkt2LhXdqPITDXj89FCeXzFwVeDraETv6mh7kooR1a43SGhInkiKodiUriOqt886C1RgClV2HxcQNoI2IdqYQ9GyE8MLkXSKDjOH7A--A8Tx_jDYBDTV-Wy3blQgtsDty7dlU8sbtIdt2g7BGLAzj7vM4IwHVEap02u75OnWY71IanX4uuvm9nyFSrffOxEWRyOqMnYON5cmNzwPRhqoK2cPlpVFsh6Ypzkfssdc1QcWeiH2v20gARzzUQ7-gL9-X-Ws4v5CHxV8hwESaPmgZyd_Xw8wIwAdZddI8mKtI9ez_wMBY56GBh556JzLmZnmJpRRPIEq2raNOYLSZG4DkagQWSuglXuIgbv5_ufoI80uOqJcB_WfkfhhSreCtSVgletH5DarnmyaDUXRZRq1uHpyriRAUzJp8rLuaxufx9ukrjjM9Ii0YPJdWv5AAD_p0_33PutbjQeSEHKu4OfDhG5NO-j9_EptTINLDt9FVxFeP3QBv0rz6_HtUcMvkp6uY=
            //
            //         process_token = b6ca31f953e1478a1383e0a7717ea1f79f2f52588a7517768e1e8e374004785d
            //
            //         payload_protocol = 1
            //
            //         pt = 1
            //
            //         w = ac7939c00e952ef76eed20bc2a21798d1e58737ec099db0b4a38a369172e2bbf762b400943f092402f9cc4caaf1c49ebeb4783538d6d8f0fb786ea7d917c2c16098dfcef0cb52fe6864fcc474e05f9db8afc240505824cdac3ab4aa13c1bfc21d1602b0cfec4d86e7f6ffc135fd0bf84c30f7201cd097798204519ab54a98d3684f57398719176bc3bd27d88520aeb2e118d6fe6f5e9d793bfa05e1579981357a2e47bca18ace553e1b4a9baacd1881b5d4e28597c7861d78f38fc308573c3375e8994b240efc43c0791571e1ac9493af894c84954fe6b6243bef210b30becb4e4a63b0c18101b5c33f141d67eac3d96789a9e9ba8ceefc221b53ea12318850bf1a1b03587dfd90a3dc882bc7968be880046b0c9455bba27df2774bf94fcde7ad850aa12ab775c93aa6e2a3f69f755ff58d630c25fbe4758477482dd2753ca43f9f28d68563ea3c11536bab0c61649a13ed6a1371be1af54b7b9845bcef44ee5fe48d276381de74ed47894c407ae2a3f73afce1289a3c2579183b63267731c03f6408cce768ca9ae8880c31facb2057a4ddc48cfeaf55b0025a0fc369b5bf84c9d3def63b1abbfec0da22d2f4a3b05be267dd23aedb20ac784b14952a6a0296b357941962bc96de50b42d32467a4b9cd29b5db1e175b2464b049e59f0d87723e23d91f08419ca2812ad4dd22657041a2fde24aa2004e71978c65799da58c3544a5bb3a0c6424db59592ab2f9183993389cf2585652b12d6e1674386cb46f7226e8acf997bb41bbd6c213482f0f2af9c25a58d9ef37c4eb235dc427c3734f628d5a94be8a3c19c0982fdca98f2b23be0fe7c85f881284a0c83d783221db1f07cde5f5673261e729a4f2c25cda9a3b37353b5b1e11baaf1834a0698565faec711a
            //
            // "
            debugger;
        }

        // 响应断点
        if (debuggerConfig.enableResponseDebugger) {

            // 如果没有指定jsonp函数的名字的话，则尝试自动抽取函数名字
            let jsonpCallbackFunctionName = debuggerConfig.callbackFunctionParamName;
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
                const jsonpResponseToString = JSON.stringify(arguments, null, 4);
                // 这里是脚本的响应断点，已经拦截到响应，跟进去holder函数就行了
                console.log(jsonpCallbackFunction);
                console.log(jsonpCallbackFunctionName);
                console.log(jsonpResponseToString);
                debugger;
            });
        }

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

}

module.exports = {
    DebuggerTester
}

