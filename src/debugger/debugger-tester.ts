import { Config } from "../config/config";
import { Debugger } from "./debugger";
import { ScriptContext } from "../context/script/script-context";

type UrlPatternType = 'equals-string' | 'contains-string' | 'match-regexp' | 'match-all';

/**
 * 用于测试是否命中断点的工具类，支持对请求和响应的断点测试。
 */
export class DebuggerTester {
    /**
     * 测试是否命中断点。
     *
     * @param globalConfig - 全局配置对象，包含断点的全局设置。
     * @param debuggerConfig - 断点配置对象，包含断点的具体设置。
     * @param scriptContext - 脚本上下文对象，包含请求和响应的详细信息。
     * @returns 如果命中断点则返回 true，否则返回 false。
     */
    public test(globalConfig: Config, debuggerConfig: Debugger, scriptContext: ScriptContext): boolean {
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

    /**
     * 测试请求的 URL 是否匹配断点的 URL 模式。
     *
     * @param urlPatternType - URL 匹配模式类型（例如："equals-string"、"contains-string" 等）。
     * @param urlPattern - URL 匹配模式的值。
     * @param url - 要测试匹配的 URL。
     * @returns 如果 URL 匹配模式则返回 true，否则返回 false。
     */
    private testUrlPattern(urlPatternType: UrlPatternType, urlPattern: string | RegExp, url: string): boolean {
        if (!url) {
            return false;
        }

        if (!urlPattern) {
            return true;
        }

        switch (urlPatternType) {
            case "equals-string":
                return this.testUrlPatternForEquals(urlPattern as string, url);
            case "contains-string":
                return this.testUrlPatternForContains(urlPattern as string, url);
            case "match-regexp":
                return this.testUrlPatternForMatchRegexp(urlPattern as string, url);
            case "match-all":
                return this.testUrlPatternForMatchAll(urlPattern as string, url);
            default:
                return false;
        }
    }

    /**
     * 测试 URL 是否完全匹配给定的模式。
     *
     * @param urlPattern - 要匹配的 URL 模式。
     * @param url - 要测试的 URL。
     * @returns 如果 URL 完全匹配模式则返回 true，否则返回 false。
     */
    private testUrlPatternForEquals(urlPattern: string, url: string): boolean {
        return url === urlPattern;
    }

    /**
     * 测试 URL 是否包含给定的关键字。
     *
     * @param urlPattern - 要匹配的关键字。
     * @param url - 要测试的 URL。
     * @returns 如果 URL 包含关键字则返回 true，否则返回 false。
     */
    private testUrlPatternForContains(urlPattern: string, url: string): boolean {
        return url.indexOf(urlPattern) !== -1;
    }

    /**
     * 测试 URL 是否匹配给定的正则表达式。
     *
     * @param urlPattern - 要匹配的正则表达式。
     * @param url - 要测试的 URL。
     * @returns 如果 URL 匹配正则表达式则返回 true，否则返回 false。
     */
    private testUrlPatternForMatchRegexp(urlPattern: string, url: string): boolean {
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
     * @param urlPattern - 忽略此参数。
     * @param url - 忽略此参数。
     * @returns 始终返回 true。
     */
    private testUrlPatternForMatchAll(urlPattern: string, url: string): boolean {
        return true;
    }

    /**
     * 测试响应是否命中断点。
     *
     * @param globalConfig - 全局配置对象，包含断点的全局设置。
     * @param debuggerConfig - 断点配置对象，包含断点的具体设置。
     * @param scriptContext - 脚本上下文对象，包含请求和响应的详细信息。
     * @returns 如果命中断点则返回 true，否则返回 false。
     */
    public testForResponse(globalConfig: Config, debuggerConfig: Debugger, scriptContext: ScriptContext): boolean {
        // 首先 URL 要能够匹配得上
        if (!this.testUrlPattern(debuggerConfig.urlPatternType as UrlPatternType, debuggerConfig.urlPattern, scriptContext.url)) {
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
     * @param globalConfig - 全局配置对象，包含断点的全局设置。
     * @param scriptContext - 脚本上下文对象，包含请求和响应的详细信息。
     * @returns 如果需要打印到控制台则返回 true，否则返回 false。
     */
    public isNeedPrintToConsole(globalConfig: Config, scriptContext: ScriptContext): boolean {
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

    /**
     * 测试 URL 是否匹配指定的模式（公共方法）
     * 
     * @param urlPatternType - URL 匹配模式类型
     * @param urlPattern - URL 匹配模式的值
     * @param url - 要测试的 URL
     * @returns 如果 URL 匹配模式则返回 true，否则返回 false
     */
    public testUrl(urlPatternType: UrlPatternType, urlPattern: string | RegExp, url: string): boolean {
        return this.testUrlPattern(urlPatternType, urlPattern, url);
    }
} 