const Debugger = require("../debugger/debugger");
const {JsonpCallbackFunctionAnalyzer} = require("../analyzer/response-analyzer");
const {ScriptContext} = require("../context/script/script-context");
const {RequestContext} = require("../context/request/request-context");
const {RequestAnalyzer} = require("../analyzer/request-analyzer");
const {getGlobalConfig} = require("../config/config");

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
                    // 初始化请求上下文
                    const requestContext = RequestContext.parseRequestContext(newSrc);
                    const scriptContext = new ScriptContext(newSrc, requestContext, null);

                    const requestAnalyzer = new RequestAnalyzer();
                    requestAnalyzer.analyze(requestContext);

                    // 在请求发送之前测试断点

                    getGlobalConfig().testAll(scriptContext);
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
