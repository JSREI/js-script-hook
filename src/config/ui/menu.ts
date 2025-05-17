import { ConfigurationComponent } from "./component/configuration-component";
import { getGlobalConfig } from "../config";

declare const GM_registerMenuCommand: (name: string, callback: () => void) => number;
declare const GM_setValue: (key: string, value: boolean) => void;
declare const GM_getValue: (key: string) => boolean | undefined;

export function registerMenu(): void {
    GM_registerMenuCommand(
        "Configuration",
        function () {
            // 无论在什么页面，直接打开配置界面
            show();
        }
    );
}

export function show(): void {
    const configurationComponent = new ConfigurationComponent();
    configurationComponent.show();
}

function currentInProjectRepo(): boolean {
    return window.location.href.toLowerCase().startsWith("https://github.com/jsrei/js-script-hook");
} 