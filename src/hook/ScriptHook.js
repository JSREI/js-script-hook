/**
 * 用于给script添加Hook
 */
const Debugger = require("../debugger/Debugger");
const {DebuggerManager} = require("../debugger/DebuggerManager");
const {JsonpCallbackFunctionAnalyzer} = require("../jsonp/JsonpCallbackFunctionAnalyzer");
const {ScriptContext} = require("../context/script/ScriptContext");
const {RequestContext} = require("../context/request/RequestContext");

class ScriptHook {

    constructor(script) {
        this.script = script;
    }

    addHook() {
        // 在设置src时拦截，然后就可以去追溯src是怎么来的了
        let srcHolder = null;
        Object.defineProperty(this.script, "src", {
            get: function () {
                return srcHolder;
            }, set: function (newSrc) {

                // 测试断点
                const scriptContext = new ScriptContext(newSrc, RequestContext.parseRequestContext(newSrc), null);
                DebuggerManager.testAll(scriptContext);

                // 这里认为script不会被复用，所以添加的hook在设置src的时候就会被删除掉，会有script复用的情况吗？
                delete this.script.src;
                srcHolder = this.script.src = newSrc;
            }, configurable: true
        });
    }

}

module.exports = {
    ScriptHook
}
