import { Language } from "../language";
import { DebuggerComponent, DebuggerConfig } from "../debugger";
import { getGlobalConfig } from "../../../config";
import { createNewDebuggerConfig } from "./utils";
import { createLogger } from "../../../../logger";
import { LanguageEventManager } from "../language-event";

const debuggerManagerEventsLogger = createLogger('debugger-manager-events');

/**
 * 为调试器管理器组件绑定事件
 * @param managerElement 管理器元素
 * @param language 语言配置
 * @param debuggerComponents 调试器组件数组
 */
export function bindDebuggerManagerEvents(
    managerElement: HTMLElement,
    language: Language,
    debuggerComponents: DebuggerComponent[]
): void {
    try {
        // 添加新调试器事件
        const addButton = managerElement.querySelector("#js-script-hook-add-debugger-btn");
        if (addButton) {
            addButton.addEventListener('click', () => {
                const debuggerComponent = new DebuggerComponent();
                const newDebuggerConfig = createNewDebuggerConfig();
                const debuggerList = managerElement.querySelector("#js-script-hook-debugger-list");
                
                // 获取当前最新的语言配置
                const currentLanguage = LanguageEventManager.getInstance().getCurrentLanguage() || language;
                
                if (debuggerList) {
                    debuggerComponents.push(debuggerComponent);
                    debuggerList.appendChild(debuggerComponent.render(currentLanguage, newDebuggerConfig as unknown as DebuggerConfig));
                }

                getGlobalConfig().addDebugger(newDebuggerConfig);
                getGlobalConfig().persist();
            });
        }
    } catch (error) {
        debuggerManagerEventsLogger.error(`绑定调试器管理器事件时出错: ${error}`);
    }
} 