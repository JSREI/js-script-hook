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
                <div class="js-script-hook-tips-icon">
                    ?
                    <div class="js-script-hook-tooltip">
                        ${language.debugger_config.enableTips}
                    </div>
                </div>
                <span>${language.debugger_config.enable}</span>
            </td>
            <td align="left" id="${debuggerConfig.id}-enable-checkbox-container">
                <!-- 复选框组件将在render方法中添加 -->
            </td>
        </tr>
        <tr>
            <td align="right">
                <div class="js-script-hook-tips-icon">
                    ?
                    <div class="js-script-hook-tooltip">
                        ${language.debugger_config.urlPatternTips}
                    </div>
                </div>
                <span>${language.debugger_config.urlPattern}</span>
            </td>
            <td align="left" id="${debuggerConfig.id}-url-pattern-type-container">
                <!-- URL匹配方式选择器将在render方法中添加 -->
            </td>
        </tr>
        <tr>
            <td align="right">
                <div class="js-script-hook-tips-icon">
                    ?
                    <div class="js-script-hook-tooltip">
                        ${language.debugger_config.urlPatternTextTips}
                    </div>
                </div>
                <span>${language.debugger_config.urlPatternKeyword}</span>
            </td>
            <td align="left" id="${debuggerConfig.id}-url-pattern-input-container">
                <!-- URL匹配输入框将在render方法中添加 -->
            </td>
        </tr>
        <tr>
            <td align="right">
                <div class="js-script-hook-tips-icon">
                    ?
                    <div class="js-script-hook-tooltip">
                        ${language.debugger_config.urlPatternTestTips}
                    </div>
                </div>
                <span>${language.debugger_config.urlPatternTest}</span>
            </td>
            <td align="left" id="${debuggerConfig.id}-url-pattern-test-container">
                <!-- URL测试按钮将在render方法中添加 -->
            </td>
        </tr>
        <tr>
            <td align="right">
                <div class="js-script-hook-tips-icon">
                    ?
                    <div class="js-script-hook-tooltip">
                        ${language.debugger_config.enableRequestDebuggerTips}
                    </div>
                </div>
                <span>${language.debugger_config.enableRequestDebugger}</span>
            </td>
            <td align="left" id="${debuggerConfig.id}-enable-request-debugger-container">
                <!-- 请求断点复选框将在render方法中添加 -->
            </td>
        </tr>
        <tr>
            <td align="right">
                <div class="js-script-hook-tips-icon">
                    ?
                    <div class="js-script-hook-tooltip">
                        ${language.debugger_config.enableResponseDebuggerTips}
                    </div>
                </div>
                <span>${language.debugger_config.enableResponseDebugger}</span>
            </td>
            <td align="left" id="${debuggerConfig.id}-enable-response-debugger-container">
                <!-- 响应断点复选框将在render方法中添加 -->
            </td>
        </tr>
        <tr>
            <td align="right">
                <div class="js-script-hook-tips-icon">
                    ?
                    <div class="js-script-hook-tooltip">
                        ${language.debugger_config.callbackFunctionParamNameTips}
                    </div>
                </div>
                <span>${language.debugger_config.callbackFunctionParamName}</span>
            </td>
            <td align="left" id="${debuggerConfig.id}-callback-function-param-name-container">
                <!-- 回调函数参数名输入框将在render方法中添加 -->
            </td>
        </tr>
        <tr>
            <td align="right">
                <div class="js-script-hook-tips-icon">
                    ?
                    <div class="js-script-hook-tooltip">
                        ${language.debugger_config.commentTips}
                    </div>
                </div>
                <span>${language.debugger_config.comment}</span>
            </td>
            <td align="left" id="${debuggerConfig.id}-comment-container">
                <!-- 备注输入框将在render方法中添加 -->
            </td>
        </tr>
    </table>
</fieldset>
    `;
} 