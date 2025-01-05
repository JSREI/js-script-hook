const {registerMenu} = require("../config/ui/menu");
const {Debugger} = require("../debugger/debugger");
const {getUnsafeWindow} = require("../utils/scope-util");
const {DocumentHook} = require("../hook/document-hook");
const {initConfig, getGlobalConfig} = require("../config/config");
const {ConfigurationComponent} = require("../config/ui/component/configuration-component");

/**
 * 初始化整个脚本
 */
function init() {

    // 加载配置
    initConfig();

    // 增加可视化的配置
    registerMenu();

    // 增加一个测试断点
    // const jsonpDebugger = new Debugger("test", true, "match-regexp", /xxxxx/);
    // getGlobalConfig().addDebugger(jsonpDebugger);

    // 为document增加hook点
    const unsafeWindow = getUnsafeWindow();
    new DocumentHook(unsafeWindow.document).addHook();

    if (GM_getValue("js-script-hook-open-configuration")) {
        GM_setValue("js-script-hook-open-configuration", false);
        const configurationComponent = new ConfigurationComponent();
        configurationComponent.show();
    }

}

module.exports = {
    init
}
