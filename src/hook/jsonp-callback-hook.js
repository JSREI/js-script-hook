const {getUnsafeWindow} = require("../utils/scope-util");
const {ObjectFunctionHook} = require("./object-function-hook");
const {ResponseContext} = require("../context/response/response-context");
const {ResponseFormatter} = require("../formatter/response-formatter");
const {getGlobalConfig} = require("../config/config");
const {DebuggerTester} = require("../debugger/debugger-tester");
const {RequestFormatter} = require("../formatter/request-formatter");

/**
 * 给JSONP的回调函数增加hook
 */
class JsonpCallbackHook {

    /**
     *
     * @param scriptContext {ScriptContext}
     * @param hitDebuggers {Array<Debugger>}
     */
    constructor(scriptContext, hitDebuggers) {
        this.scriptContext = scriptContext;
        this.hitDebuggers = hitDebuggers;
    }

    /**
     *
     */
    addHook() {

        // 如果没有指定jsonp函数的名字的话，则尝试自动抽取函数名字
        let jsonpCallbackFunctionName = this.collectJsonpCallbackFunctionNameFromHitDebuggers();
        if (!jsonpCallbackFunctionName) {
            jsonpCallbackFunctionName = this.scriptContext.requestContext.getJsonpCallbackFuncName();
        }
        if (!jsonpCallbackFunctionName) {
            return;
        }

        // 为响应体中的回调函数增加hook
        const jsonpCallbackFunction = getUnsafeWindow()[jsonpCallbackFunctionName];
        if (!jsonpCallbackFunction) {
            // TODO 2024-12-20 23:08:29 错误处理
            return;
        }
        // 跟进去这个 jsonpCallbackFunction 函数的代码位置就是jsonp的回调函数的逻辑，也是处理响应的逻辑
        const _this = this;
        new ObjectFunctionHook(getUnsafeWindow(), jsonpCallbackFunctionName).addHook(function () {

            const responseContext = _this.scriptContext.responseContext = new ResponseContext("", arguments);

            // 只在有必要的情况下打印
            if (new DebuggerTester().isNeedPrintToConsole(getGlobalConfig(), _this.scriptContext)) {
                const s = new ResponseFormatter().format(_this.scriptContext);
                console.log(s);
            }

            const hitDebuggers = getGlobalConfig().testAllForResponse(_this.scriptContext);
        });
    }

    collectJsonpCallbackFunctionNameFromHitDebuggers() {
        for (let debuggerConfig of this.hitDebuggers) {
            if (debuggerConfig.callbackFunctionParamName) {
                const callbackFunctionName = this.scriptContext.requestContext.getParamValueByName(debuggerConfig.callbackFunctionParamName);
                if (callbackFunctionName) {
                    return callbackFunctionName;
                }
            }
        }
    }

}

module.exports = {
    JsonpCallbackHook
}
