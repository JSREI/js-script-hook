const {ScriptContext} = require("../context/script/script-context");
const {RequestContext} = require("../context/request/request-context");
const {RequestAnalyzer} = require("../analyzer/request-analyzer");
const {getGlobalConfig} = require("../config/config");
const {RequestFormatter} = require("../formatter/request-formatter");
const {JsonpCallbackHook} = require("./jsonp-callback-hook");
const {formatScriptSrcToUrl} = require("../utils/url-util");
const {DebuggerTester} = require("../debugger/debugger-tester");

/**
 * 用于给script添加Hook
 */
class ScriptHook {

    /**
     *
     * @param script {HTMLScriptElement}
     */
    constructor(script) {
        this.script = script;
    }

    /**
     *
     */
    addHook() {
        const _this = this;
        // 在设置src时拦截，然后就可以去追溯src是怎么来的了
        let srcHolder = null;
        Object.defineProperty(this.script, "src", {
            get: function () {
                return srcHolder;
            }, set: function (newSrc) {

                // 尽量不要影响页面原有的流程
                try {
                    const formattedScriptSrc = formatScriptSrcToUrl(newSrc);
                    // 初始化请求上下文
                    const requestContext = RequestContext.parseRequestContext(formattedScriptSrc);
                    const scriptContext = new ScriptContext(formattedScriptSrc, requestContext, null);

                    const requestAnalyzer = new RequestAnalyzer();
                    requestAnalyzer.analyze(requestContext);

                    // 在请求发送之前测试断点
                    if (new DebuggerTester().isNeedPrintToConsole(getGlobalConfig(), scriptContext)) {
                        const requestFormatter = new RequestFormatter();
                        requestFormatter.format(scriptContext)
                    }

                    const hitDebuggers = getGlobalConfig().testAll(scriptContext);
                    new JsonpCallbackHook(scriptContext, hitDebuggers).addHook();
                } catch (e) {
                    console.error(e);
                }

                // 这里认为script不会被复用，所以添加的hook在设置src的时候就会被删除掉，会有script复用的情况吗？
                delete _this.script.src;
                srcHolder = _this.script.src = newSrc;
            },
            configurable: true
        });
    }

}

module.exports = {
    ScriptHook
}
