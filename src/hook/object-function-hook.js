const {getGlobalConfig} = require("../config/config");
const {getFunctionBody, getParameterNames, generateRandomFunctionName} = require("../utils/code-util");
const {getUnsafeWindow} = require("../utils/scope-util");
const {getLanguage} = require("../config/ui/component/language");

const hookTypeUseProxyFunction = 1;
const hookTypeUseDeclareFunction = 2;

/**
 * 为全局的函数添加Hook，因为是要在新的script中调用，所以这些jsonp函数声明的都是全局作用域
 */
class ObjectFunctionHook {

    /**
     *
     * @param object
     * @param functionName
     */
    constructor(object, functionName) {

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
     *
     * @param hookCallbackFunction
     */
    addHook(hookCallbackFunction) {

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
        const prefix = "JSREI_js_script_hook"
        const hookDoneFlag = prefix + "_hookDoneFlag";
        if (functionHolder[hookDoneFlag]) {
            return;
        }

        if (this.hookType === hookTypeUseProxyFunction) {
            this.hookUseProxyFunction(functionHolder, hookCallbackFunction);
        } else {
            this.hookUseRedeclareFunction(functionHolder, hookCallbackFunction);
        }

        // 设置标记位，防止重复Hook
        this.object[this.functionName][hookDoneFlag] = true;
    }

    /**
     *
     * 直接修改原有函数代码的方式实现hook，注意，这种方式可能有点高危
     *
     * @param functionHolder
     * @param hookCallbackFunction
     */
    hookUseRedeclareFunction(functionHolder, hookCallbackFunction) {
        const hookCallbackFunctionGlobalName = generateRandomFunctionName(100);
        getUnsafeWindow()[hookCallbackFunctionGlobalName] = hookCallbackFunction
        let functionBodyCode = getFunctionBody(functionHolder);
        let parameterNames = getParameterNames(functionHolder);
        // TODO 2025-01-07 23:41:26 调用 hookCallbackFunction
        // TODO 2025-01-06 03:19:19 提示语也国际化，根据设置的语言选择
        const newFunctionCode = `
        
        // 这里就是jsonp的回调函数的方法体，这是插入的hook代码 
        // 判断是否命中断点 
        const isHitDebugger = ${hookCallbackFunctionGlobalName}.apply(this, arguments);
        delete window["${hookCallbackFunctionGlobalName}"];
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
     *
     * 使用代理函数替换的方式来实现hook
     *
     * @param functionHolder
     * @param hookCallbackFunction
     */
    hookUseProxyFunction(functionHolder, hookCallbackFunction) {
        const _this = this;
        // 为函数添加Hook
        this.object[this.functionName] = function () {

            if (_this.callByHookCallbackFunction) {
                // 由hook函数自行调用被hook函数
                try {
                    hookCallbackFunction.apply(this, [{
                        "hookFunctionHolder": functionHolder,
                        "args": arguments
                    }]);
                } catch (e) {
                    console.error(e);
                }
            } else {
                // 不干扰流程，hook函数只作为观测
                try {
                    // TODO 2023-8-21 22:15:09 在函数执行的时候尝试触发各种断点
                    hookCallbackFunction.apply(this, arguments);
                } catch (e) {
                    console.error(e);
                }
                return functionHolder.apply(this, arguments);
            }
        }
    }

}

module.exports = {
    ObjectFunctionHook,
    hookTypeUseProxyFunction,
    hookTypeUseDeclareFunction,
}
