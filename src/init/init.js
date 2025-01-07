const {registerMenu, show} = require("../config/ui/menu");
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

    // 为document增加hook点
    new DocumentHook(getUnsafeWindow().document).addHook();

    if (GM_getValue("js-script-hook-open-configuration")) {
        GM_setValue("js-script-hook-open-configuration", false);
        show();
    }

}

module.exports = {
    init
}
