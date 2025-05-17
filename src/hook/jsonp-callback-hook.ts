import { getUnsafeWindow } from '../utils/scope-util';
import { ObjectFunctionHook, hookTypeUseDeclareFunction, hookTypeUseProxyFunction } from './object-function-hook';
import { ResponseContext } from '../context/response/response-context';
import { ResponseFormatter } from '../formatter/response-formatter';
import { getGlobalConfig } from '../config/config';
import { DebuggerTester } from '../debugger/debugger-tester';
import { RequestFormatter } from '../formatter/request-formatter';
import { ScriptContext } from '../context/script/script-context';
import { Debugger } from '../debugger/debugger';
import { createLogger } from '../logger';

// 创建JSONP回调钩子专用的日志记录器
const jsonpHookLogger = createLogger('jsonp-hook');

interface HookFunctionArgs {
    hookFunctionHolder: Function;
    args: IArguments;
}

interface UnsafeWindow extends Window {
    [key: string]: any;
}

/**
 * 给JSONP的回调函数增加hook
 */
export class JsonpCallbackHook {
    private readonly scriptContext: ScriptContext;
    private readonly hitDebuggers: Debugger[];

    /**
     * 构造函数
     * @param scriptContext - 脚本上下文
     * @param hitDebuggers - 命中的断点列表
     */
    constructor(scriptContext: ScriptContext, hitDebuggers: Debugger[]) {
        this.scriptContext = scriptContext;
        this.hitDebuggers = hitDebuggers;
    }

    /**
     * 添加hook
     */
    public addHook(): void {
        // 如果没有指定jsonp函数的名字的话，则尝试自动抽取函数名字
        let jsonpCallbackFunctionName = this.collectJsonpCallbackFunctionNameFromHitDebuggers();
        if (!jsonpCallbackFunctionName) {
            jsonpCallbackFunctionName = this.scriptContext.requestContext?.getJsonpCallbackFuncName() || null;
        }
        if (!jsonpCallbackFunctionName) {
            jsonpHookLogger.debug('未找到JSONP回调函数名称，跳过添加钩子');
            return;
        }

        jsonpHookLogger.debug(`检测到JSONP回调函数: ${jsonpCallbackFunctionName}`);

        // 为响应体中的回调函数增加hook
        const unsafeWindow = getUnsafeWindow() as UnsafeWindow;
        const jsonpCallbackFunction = unsafeWindow[jsonpCallbackFunctionName];
        if (!jsonpCallbackFunction) {
            jsonpHookLogger.warn(`未找到全局回调函数: ${jsonpCallbackFunctionName}`);
            return;
        }
        
        // 跟进去这个 jsonpCallbackFunction 函数的代码位置就是jsonp的回调函数的逻辑，也是处理响应的逻辑
        const _this = this;
        const hook = new ObjectFunctionHook(unsafeWindow, jsonpCallbackFunctionName);
        if (getGlobalConfig().hookType === "use-redeclare-function") {
            jsonpHookLogger.debug(`使用重声明函数方式添加钩子: ${jsonpCallbackFunctionName}`);
            hook.hookType = hookTypeUseDeclareFunction;
            hook.addHook(this.callbackForDeclareFunction(_this));
        } else if (getGlobalConfig().hookType === "use-proxy-function") {
            jsonpHookLogger.debug(`使用代理函数方式添加钩子: ${jsonpCallbackFunctionName}`);
            hook.hookType = hookTypeUseProxyFunction;
            hook.callByHookCallbackFunction = true;
            hook.addHook(this.callbackForProxyFunction(_this));
        }
        
        jsonpHookLogger.info(`JSONP回调函数钩子添加完成: ${jsonpCallbackFunctionName}`);
    }

    /**
     * 声明函数方式实现hook时的回调函数
     */
    private callbackForDeclareFunction(_this: JsonpCallbackHook): (...args: any[]) => number {
        return function (this: any, ...args: any[]): number {
            jsonpHookLogger.debug('JSONP回调函数被调用（声明函数方式）');
            
            const responseContext = new ResponseContext("", args);
            Object.defineProperty(_this.scriptContext, 'responseContext', {
                value: responseContext,
                writable: true,
                configurable: true
            });

            // 只在有必要的情况下打印
            if (new DebuggerTester().isNeedPrintToConsole(getGlobalConfig(), _this.scriptContext)) {
                jsonpHookLogger.info('JSONP响应匹配调试规则，将输出到控制台');
                new ResponseFormatter().format(_this.scriptContext);
            }

            const hitDebuggers = getGlobalConfig().testAllForResponse(_this.scriptContext);
            if (hitDebuggers.length > 0) {
                jsonpHookLogger.info(`JSONP响应命中${hitDebuggers.length}个断点规则`);
            }
            return hitDebuggers.length;
        };
    }

    /**
     * 代理函数方式实现hook时的回调函数
     */
    private callbackForProxyFunction(_this: JsonpCallbackHook): (arg: HookFunctionArgs) => void {
        return function (this: any, { hookFunctionHolder, args }: HookFunctionArgs): void {
            jsonpHookLogger.debug('JSONP回调函数被调用（代理函数方式）');
            
            const responseContext = new ResponseContext("", Array.from(args));
            Object.defineProperty(_this.scriptContext, 'responseContext', {
                value: responseContext,
                writable: true,
                configurable: true
            });

            // 只在有必要的情况下打印
            if (new DebuggerTester().isNeedPrintToConsole(getGlobalConfig(), _this.scriptContext)) {
                jsonpHookLogger.info('JSONP响应匹配调试规则，将输出到控制台');
                new ResponseFormatter().format(_this.scriptContext);
            }

            const hitDebuggers = getGlobalConfig().testAllForResponse(_this.scriptContext);
            const isHitDebugger = hitDebuggers.length;

            if (isHitDebugger) {
                jsonpHookLogger.info(`JSONP响应命中${isHitDebugger}个断点规则，将触发断点`);
                // 把一些相关的上下文赋值到变量方便断点命中这里的时候观察
                // _scriptContext中存放的是与当前的script请求相关的一些上下文信息
                // humanReadableScriptInformation 存放的是上下文格式化后的一些可读的信息
                const humanReadableScriptInformation = _this.scriptContext.toHumanReadable();
                debugger;
            }

            // 跟进去这个函数，就是jsonp的callback函数
            jsonpHookLogger.debug('调用原始JSONP回调函数');
            hookFunctionHolder.apply(this, args);
        };
    }

    /**
     * 从命中的断点中收集jsonp的回调函数名称
     */
    private collectJsonpCallbackFunctionNameFromHitDebuggers(): string | null {
        for (const debuggerConfig of this.hitDebuggers) {
            if (debuggerConfig.callbackFunctionName) {
                const callbackFunctionName = this.scriptContext.requestContext?.getParamValueByName(debuggerConfig.callbackFunctionName);
                if (callbackFunctionName) {
                    jsonpHookLogger.debug(`从断点配置中找到回调函数名称: ${callbackFunctionName}`);
                    return callbackFunctionName;
                }
            }
        }
        return null;
    }
} 