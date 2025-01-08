const {ConfigurationComponent} = require("./component/configuration-component");
const {appendScriptHookStyleToCurrentPage} = require("./component/style");
const {getGlobalConfig} = require("../config");

function registerMenu() {
    let id = GM_registerMenuCommand(
        "Configuration",
        function () {

            if (getGlobalConfig().autoJumpProjectSiteOnConfiguraion) {
                // 重定向到项目的主页，要不然怕有样式不兼容
                GM_setValue("js-script-hook-open-configuration", true);
                if (!currentInProjectRepo()) {
                    window.location.href = "https://github.com/JSREI/js-script-hook";
                } else {
                    if (!GM_getValue("js-script-hook-open-configuration")) {
                        return;
                    }
                    GM_setValue("js-script-hook-open-configuration", false);
                    show();
                }
            } else {
                show();
            }
        }
    );
}

function show() {
    // 只在需要的时候才追加样式表，尽可能的避免样式污染
    appendScriptHookStyleToCurrentPage();
    const configurationComponent = new ConfigurationComponent();
    configurationComponent.show();
}

function currentInProjectRepo() {
    return window.location.href.toLowerCase().startsWith("https://github.com/jsrei/js-script-hook");
}

module.exports = {
    registerMenu,
    show
}

