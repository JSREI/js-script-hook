import { DebuggerConfig } from './types';
import { Language } from '../language';

/**
 * 构造调试器组件的HTML模板
 * @param language 语言配置
 * @param debuggerConfig 断点配置
 * @returns 模板字符串
 */
export function createDebuggerTemplate(language: Language, debuggerConfig: DebuggerConfig): string {
    return `
<fieldset id="${debuggerConfig.id}" class="debugger-component-fieldset">      
    <legend class="debugger-component-legend">${language.debugger_config.debuggerTitle}-${debuggerConfig.id}</legend>          
    <button id="${debuggerConfig.id}-remove-btn" class="debugger-component-remove-btn" title="${language.basic.deleteButton}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    </button>
    <table class="debugger-component-table">
        <tr>
            <td align="right">
                <div class="tips-label-container">
                    <span id="${debuggerConfig.id}-enable-tip-container" class="tip-container"></span>
                    <span class="label-text">${language.debugger_config.enable}</span>
                </div>
            </td>
            <td align="left" id="${debuggerConfig.id}-enable-checkbox-container">
                <!-- 复选框组件将在render方法中添加 -->
            </td>
        </tr>
        <tr>
            <td align="right">
                <div class="tips-label-container">
                    <span id="${debuggerConfig.id}-url-pattern-tip-container" class="tip-container"></span>
                    <span class="label-text">${language.debugger_config.urlPattern}</span>
                </div>
            </td>
            <td align="left" id="${debuggerConfig.id}-url-pattern-type-container">
                <!-- URL匹配方式选择器将在render方法中添加 -->
            </td>
        </tr>
        <tr>
            <td align="right">
                <div class="tips-label-container">
                    <span id="${debuggerConfig.id}-url-pattern-text-tip-container" class="tip-container"></span>
                    <span class="label-text">${language.debugger_config.urlPatternKeyword}</span>
                </div>
            </td>
            <td align="left" id="${debuggerConfig.id}-url-pattern-input-container">
                <!-- URL匹配输入框将在render方法中添加 -->
            </td>
        </tr>
        <tr>
            <td align="right">
                <div class="tips-label-container">
                    <span id="${debuggerConfig.id}-url-pattern-test-tip-container" class="tip-container"></span>
                    <span class="label-text">${language.debugger_config.urlPatternTest}</span>
                </div>
            </td>
            <td align="left" id="${debuggerConfig.id}-url-pattern-test-container">
                <!-- URL测试按钮将在render方法中添加 -->
            </td>
        </tr>
        <tr>
            <td align="right">
                <div class="tips-label-container">
                    <span id="${debuggerConfig.id}-enable-request-debugger-tip-container" class="tip-container"></span>
                    <span class="label-text">${language.debugger_config.enableRequestDebugger}</span>
                </div>
            </td>
            <td align="left" id="${debuggerConfig.id}-enable-request-debugger-container">
                <!-- 请求断点复选框将在render方法中添加 -->
            </td>
        </tr>
        <tr>
            <td align="right">
                <div class="tips-label-container">
                    <span id="${debuggerConfig.id}-enable-response-debugger-tip-container" class="tip-container"></span>
                    <span class="label-text">${language.debugger_config.enableResponseDebugger}</span>
                </div>
            </td>
            <td align="left" id="${debuggerConfig.id}-enable-response-debugger-container">
                <!-- 响应断点复选框将在render方法中添加 -->
            </td>
        </tr>
        <tr>
            <td align="right">
                <div class="tips-label-container">
                    <span id="${debuggerConfig.id}-callback-function-param-name-tip-container" class="tip-container"></span>
                    <span class="label-text">${language.debugger_config.callbackFunctionParamName}</span>
                </div>
            </td>
            <td align="left" id="${debuggerConfig.id}-callback-function-param-name-container">
                <!-- 回调函数参数名输入框将在render方法中添加 -->
            </td>
        </tr>
        <tr>
            <td align="right">
                <div class="tips-label-container">
                    <span id="${debuggerConfig.id}-comment-tip-container" class="tip-container"></span>
                    <span class="label-text">${language.debugger_config.comment}</span>
                </div>
            </td>
            <td align="left" id="${debuggerConfig.id}-comment-container">
                <!-- 备注输入框将在render方法中添加 -->
            </td>
        </tr>
    </table>
</fieldset>
    `;
} 