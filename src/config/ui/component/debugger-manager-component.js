const {DebuggerComponent} = require("./debugger-component");
const {Debugger} = require("../../../debugger/debugger");
const {randomId} = require("../../../utils/id-util");
const {getGlobalConfig} = require("../../config");

class DebuggerManagerComponent {

    constructor() {
        this.html = `
<div>
    <div id="js-script-hook-debugger-list"></div>
    <div id="js-script-hook-add-debugger">
        <button id="js-script-hook-add-debugger-btn" style="font-size: 100px !important; border: 1px solid black !important; display: inline-block !important; width: 800px !important; padding: 10px !important; margin: 10px !important; height: 200px !important; cursor:pointer !important;">+</button>
    </div>
</div>
        `;
    }

    /**
     *
     * @param language
     * @param debuggers {Array<Debugger>}
     */
    render(language, debuggers) {

        // 按照最后修改时间排序
        debuggers.sort((a, b) => {
            const t1 = parseInt(a.updateTime || 0);
            const t2 = parseInt(b.updateTime || 0);
            return t2 - t1;
        });

        const debuggerManager = $(this.html);

        // 渲染已经存在的断点配置信息
        for (let debuggerInformation of debuggers) {
            const debuggerComponent = new DebuggerComponent();
            debuggerManager.find("#js-script-hook-debugger-list").append(debuggerComponent.render(language, debuggerInformation));
        }

        // 增加断点配置
        debuggerManager.find("#js-script-hook-add-debugger-btn").click(() => {
            const debuggerComponent = new DebuggerComponent();
            const newDebuggerConfig = new Debugger();
            newDebuggerConfig.id = randomId();
            newDebuggerConfig.enable = true;
            newDebuggerConfig.urlPatternType = "match-all";
            newDebuggerConfig.urlPattern = "";
            newDebuggerConfig.enableRequestDebugger = true;
            newDebuggerConfig.enableResponseDebugger = true;
            newDebuggerConfig.callbackFunctionParamName = "";
            newDebuggerConfig.comment = "";
            debuggerManager.find("#js-script-hook-debugger-list").append(debuggerComponent.render(language, newDebuggerConfig));

            getGlobalConfig().addDebugger(newDebuggerConfig);
            getGlobalConfig().persist();
        });

        return debuggerManager;
    }

}

module.exports = {
    DebuggerManagerComponent
}
