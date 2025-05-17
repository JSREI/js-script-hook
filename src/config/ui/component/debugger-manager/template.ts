import { Language } from "../language";

/**
 * 创建调试器管理器组件的HTML模板
 * @param language 语言配置
 * @returns 模板字符串
 */
export function createDebuggerManagerTemplate(language: Language): string {
    return `
<div>
    <div id="js-script-hook-debugger-list"></div>
    <div id="js-script-hook-add-debugger">
        <button id="js-script-hook-add-debugger-btn">
            <span class="plus-icon">+</span>
            <span>${language.tabs.addNewBreakpoint}</span>
        </button>
    </div>
</div>
    `;
} 