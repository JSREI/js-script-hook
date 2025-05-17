import { ConfigurationComponent } from "./component/configuration";
import { getGlobalConfig } from "../config";
import { LanguageEventManager } from "./component/language-event";
import { getLanguage } from "./component/language";
import { createLogger } from "../../logger";

const menuLogger = createLogger('menu');

declare const GM_registerMenuCommand: (name: string, callback: () => void) => number;
declare const GM_setValue: (key: string, value: boolean) => void;
declare const GM_getValue: (key: string) => boolean | undefined;

let currentConfigurationComponent: ConfigurationComponent | null = null;

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
    if (currentConfigurationComponent) {
        currentConfigurationComponent.destroy();
    }
    currentConfigurationComponent = new ConfigurationComponent();
    currentConfigurationComponent.show();
}

/**
 * 切换语言
 * @param language 新的语言
 */
export function switchLanguage(language: string): void {
    try {
        // 获取新的语言配置
        const newLanguage = getLanguage(language);
        
        // 通知所有订阅者语言已更新
        LanguageEventManager.getInstance().notifyLanguageUpdate(newLanguage);
    } catch (error) {
        menuLogger.error(`切换语言时出错: ${error}`);
    }
}

function currentInProjectRepo(): boolean {
    return window.location.href.toLowerCase().startsWith("https://github.com/jsrei/js-script-hook");
} 