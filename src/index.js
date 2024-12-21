const {DocumentHook} = require("./hook/document-hook");
const {getUnsafeWindow} = require("./utils/scope-util");
const {debuggerManager} = require("./debugger/debugger-manager");
const {Debugger} = require("./debugger/debugger");


(async () => {
    // 增加可视化的配置

    // 增加一个测试断点
    const jsonpDebugger = new Debugger(/.*/);
    debuggerManager.addDebugger(jsonpDebugger);

    // 为document增加hook点
    const unsafeWindow = getUnsafeWindow();
    new DocumentHook(unsafeWindow.document).addHook();
})();




