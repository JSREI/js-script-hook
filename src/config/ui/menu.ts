import { ConfigurationComponent } from "./component/configuration-component";
import { appendScriptHookStyleToCurrentPage } from "./component/style";
import { getGlobalConfig } from "../config";

declare const GM_registerMenuCommand: (name: string, callback: () => void) => number;
declare const GM_setValue: (key: string, value: boolean) => void;
declare const GM_getValue: (key: string) => boolean | undefined;

export function registerMenu(): void {
    GM_registerMenuCommand(
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

export function show(): void {
    // 只在需要的时候才追加样式表，尽可能的避免样式污染
    appendScriptHookStyleToCurrentPage();
    const configurationComponent = new ConfigurationComponent();
    configurationComponent.show();
}

function currentInProjectRepo(): boolean {
    return window.location.href.toLowerCase().startsWith("https://github.com/jsrei/js-script-hook");
} 