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

        const debuggerManager = $(this.html);

        // 渲染已经存在的断点配置信息
        for (let debuggerInformation of debuggers) {
            const debuggerComponent = new DebuggerComponent();
            debuggerManager.find("#js-script-hook-debugger-list").append(debuggerComponent.render(language, debuggerInformation));
        }

        // 增加断点配置
        debuggerManager.find("#js-script-hook-add-debugger-btn").click(() => {
            const debuggerComponent = new DebuggerComponent();
            const newDebuggerInformation = new Debugger();
            newDebuggerInformation.id = randomId();
            debuggerManager.find("#js-script-hook-debugger-list").append(debuggerComponent.render(language, newDebuggerInformation));

            getGlobalConfig().addDebugger(newDebuggerInformation);
            getGlobalConfig().persist();
        });

        return debuggerManager;
    }

}

module.exports = {
    DebuggerManagerComponent
}
