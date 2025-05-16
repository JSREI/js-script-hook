import { getGlobalConfig } from "../config/config";
import { getFunctionBody, getParameterNames, generateRandomFunctionName } from "../utils/code-util";
import { getUnsafeWindow } from "../utils/scope-util";
import { getLanguage } from "../config/ui/component/language";

export const hookTypeUseProxyFunction = 1;
export const hookTypeUseDeclareFunction = 2;

type HookType = typeof hookTypeUseProxyFunction | typeof hookTypeUseDeclareFunction;

interface UnsafeWindow extends Window {
    [key: string]: any;
}

interface HookCallbackArgs {
    hookFunctionHolder: Function;
    args: IArguments;
}

/**
 * 为全局的函数添加Hook，因为是要在新的script中调用，所以这些jsonp函数声明的都是全局作用域
 */
export class ObjectFunctionHook {
    private readonly object: UnsafeWindow;
    private readonly functionName: string;
    public hookType: HookType;
    public callByHookCallbackFunction: boolean;

    /**
     * @param object - 要被hook的对象
     * @param functionName - 要被hook的函数名
     */
    constructor(object: UnsafeWindow, functionName: string) {
        // 被hook的对象
        this.object = object;
        // 被hook的函数名
        this.functionName = functionName;

        // hook的具体实现方式
        this.hookType = hookTypeUseDeclareFunction;
        // 是否由回调函数调用原函数
        this.callByHookCallbackFunction = false;
    }

    /**
     * 添加 hook
     * @param hookCallbackFunction - hook的回调函数
     */
    public addHook(hookCallbackFunction: Function): void {
        // 要Hook的函数必须存在
        const functionHolder = this.object[this.functionName];
        if (!functionHolder) {
            // TODO 2024-12-20 01:04:00 统一日志
            console.log(`hook失败，函数不存在： ${this.functionName}`);
            return;
        }

        // 如果已经Hook过了则不重复hook，也就是说一次addHook只生效一次
        // TODO 2025-01-06 03:19:19 修改为读取配置中的前缀
        // const prefix = getGlobalConfig().prefix || "JSREI_js_script_hook"
        const prefix = "JSREI_js_script_hook";
        const hookDoneFlag = prefix + "_hookDoneFlag";
        if ((functionHolder as any)[hookDoneFlag]) {
            return;
        }

        if (this.hookType === hookTypeUseProxyFunction) {
            this.hookUseProxyFunction(functionHolder, hookCallbackFunction);
        } else {
            this.hookUseRedeclareFunction(functionHolder, hookCallbackFunction);
        }

        // 设置标记位，防止重复Hook
        (this.object[this.functionName] as any)[hookDoneFlag] = true;
    }

    /**
     * 直接修改原有函数代码的方式实现hook，注意，这种方式可能有点高危
     *
     * @param functionHolder - 原始函数
     * @param hookCallbackFunction - hook的回调函数
     */
    private hookUseRedeclareFunction(functionHolder: Function, hookCallbackFunction: Function): void {
        const hookCallbackFunctionGlobalName = generateRandomFunctionName(100);
        (getUnsafeWindow() as UnsafeWindow)[hookCallbackFunctionGlobalName] = hookCallbackFunction;
        const functionBodyCode = getFunctionBody(functionHolder);
        const parameterNames = getParameterNames(functionHolder);
        // TODO 2025-01-07 23:41:26 调用 hookCallbackFunction
        // TODO 2025-01-06 03:19:19 提示语也国际化，根据设置的语言选择
        // TODO 2025-01-09 02:58:29 暂不删除函数，否则第二次运行就可能报错了，暂不考虑函数溢出的问题
        const newFunctionCode = `
        
        // 这里就是jsonp的回调函数的方法体，这是插入的hook代码 
        // 判断是否命中断点 
        const isHitDebugger = ${hookCallbackFunctionGlobalName}.apply(this, arguments);
        // delete window["${hookCallbackFunctionGlobalName}"];
        if (isHitDebugger) {
            debugger; 
        }
        
        // 下面是网站自己的callback函数的逻辑 
        // 如果有作用域报错，可以考虑：
        // 1. 在配置中把hook类型切换到代理函数模式 
        // 2. 获取根据下面的代码全局搜索定位打断点，曲线救国 
        ${functionBodyCode}
        
        `;
        this.object[this.functionName] = new Function(...parameterNames, newFunctionCode);
    }

    /**
     * 使用代理函数替换的方式来实现hook
     *
     * @param functionHolder - 原始函数
     * @param hookCallbackFunction - hook的回调函数
     */
    private hookUseProxyFunction(functionHolder: Function, hookCallbackFunction: Function): void {
        const _this = this;
        // 为函数添加Hook
        this.object[this.functionName] = function (this: any, ...args: any[]): any {
            if (_this.callByHookCallbackFunction) {
                // 由hook函数自行调用被hook函数
                try {
                    hookCallbackFunction.apply(this, [{
                        hookFunctionHolder: functionHolder,
                        args: arguments
                    } as HookCallbackArgs]);
                } catch (e) {
                    console.error(e);
                }
            } else {
                // 不干扰流程，hook函数只作为观测
                try {
                    // TODO 2023-8-21 22:15:09 在函数执行的时候尝试触发各种断点
                    hookCallbackFunction.apply(this, args);
                } catch (e) {
                    console.error(e);
                }
                return functionHolder.apply(this, args);
            }
        };
    }
} 