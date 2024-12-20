/**
 * 用来接收外部设置的断点，以及在请求时测试断点是否生效
 */
class DebuggerManager {

    constructor() {
        // 用来存储所有的断点
        // Array<Debugger>
        this.debuggers = [];
    }

    /**
     * 执行测试所有断点，看看是否有条件命中啥的
     *
     * @param scriptContext {ScriptContext}
     */
    testAll(scriptContext) {
        for (let jsonpDebugger of this.debuggers) {
            jsonpDebugger.test(scriptContext);
        }
    }

    /**
     * 添加一个断点
     *
     * @param jsonpDebugger {Debugger}
     */
    addDebugger(jsonpDebugger) {
        this.debuggers.push(jsonpDebugger);
    }

}

const debuggerManager = new DebuggerManager();

module.exports = {
    DebuggerManager,
    debuggerManager
}
