import { DebuggerConfig } from './types';
import { Language } from '../language';
import { SelectOption } from '../basic';
import { createLogger } from '../../../../logger';

const languageUpdateLogger = createLogger('language-update');

/**
 * 更新调试器组件的语言
 * @param componentElement 组件元素
 * @param language 新的语言配置
 * @param currentConfig 当前配置
 * @param selectComponent 选择组件实例
 * @param inputComponent 输入框组件实例
 * @param checkboxComponent 复选框组件实例
 * @param buttonComponent 按钮组件实例
 * @param textareaComponent 文本区域组件实例
 * @param tipsComponent 提示组件实例
 */
export function updateDebuggerLanguage(
    componentElement: HTMLElement,
    language: Language,
    currentConfig: DebuggerConfig,
    selectComponent: any,
    inputComponent: any,
    checkboxComponent: any,
    buttonComponent: any,
    textareaComponent: any,
    tipsComponent: any
): void {
    try {
        // 更新标题
        const title = componentElement.querySelector('legend');
        if (title) {
            // 显示表的标题
            title.innerHTML = `${language.debugger_config.debuggerTitle}-${currentConfig.id}`;
        }

        // 更新删除按钮提示
        const removeBtn = componentElement.querySelector(`#${currentConfig.id}-remove-btn`);
        if (removeBtn) {
            removeBtn.setAttribute('title', language.basic.deleteButton);
        }

        // 更新启用断点控制按钮
        const enableDebuggerButton = componentElement.querySelector('#js-script-hook-enable-debugger-checkbox + label');
        if (enableDebuggerButton) {
            enableDebuggerButton.textContent = language.debugger_config.enable;
        }

        // 更新请求断点控制按钮
        const enableRequestDebuggerButton = componentElement.querySelector('#js-script-hook-enable-request-debugger-checkbox + label');
        if (enableRequestDebuggerButton) {
            enableRequestDebuggerButton.textContent = language.debugger_config.enableRequestDebugger;
        }

        // 更新响应断点控制按钮
        const enableResponseDebuggerButton = componentElement.querySelector('#js-script-hook-enable-response-debugger-checkbox + label');
        if (enableResponseDebuggerButton) {
            enableResponseDebuggerButton.textContent = language.debugger_config.enableResponseDebugger;
        }

        // 更新表格内容 - 直接更新所有行标签文本内容
        const table = componentElement.querySelector('.debugger-component-table');
        if (table) {
            const rows = table.querySelectorAll('tr');
            
            // 强制更新每一行的标签文本
            updateRowLabel(rows[0], language.debugger_config.enable);
            updateRowLabel(rows[1], language.debugger_config.urlPattern);
            updateRowLabel(rows[2], language.debugger_config.urlPattern);
            updateRowLabel(rows[3], language.debugger_config.urlPatternTest);
            updateRowLabel(rows[4], language.debugger_config.enableRequestDebugger);
            updateRowLabel(rows[5], language.debugger_config.enableResponseDebugger);
            updateRowLabel(rows[6], language.debugger_config.callbackFunctionParamName);
            updateRowLabel(rows[7], language.debugger_config.comment);
            
            // 更新提示信息
            updateRowTooltip(rows[0], language.debugger_config.enableTips);
            updateRowTooltip(rows[1], language.debugger_config.urlPatternTips);
            updateRowTooltip(rows[2], language.debugger_config.urlPatternTextTips);
            updateRowTooltip(rows[3], language.debugger_config.urlPatternTestTips);
            updateRowTooltip(rows[4], language.debugger_config.enableRequestDebuggerTips);
            updateRowTooltip(rows[5], language.debugger_config.enableResponseDebuggerTips);
            updateRowTooltip(rows[6], language.debugger_config.callbackFunctionParamNameTips);
            updateRowTooltip(rows[7], language.debugger_config.commentTips);
        }

        // 更新子组件的语言
        if (selectComponent) {
            selectComponent.updateLanguage(language);
            // 更新URL匹配类型选项
            const urlPatternTypeOptions: SelectOption[] = [
                { value: 'equals-string', text: language.debugger_config.urlPatternType_EqualsThisString },
                { value: 'contains-string', text: language.debugger_config.urlPatternType_ContainsThisString },
                { value: 'match-regexp', text: language.debugger_config.urlPatternType_MatchThisRegexp },
                { value: 'match-all', text: language.debugger_config.urlPatternType_MatchALL }
            ];
            selectComponent.updateOptions(urlPatternTypeOptions);
        }
        
        // 更新其他子组件
        if (inputComponent) {
            inputComponent.updateLanguage(language);
        }
        if (checkboxComponent) {
            checkboxComponent.updateLanguage(language);
        }
        if (buttonComponent) {
            buttonComponent.updateLanguage(language);
        }
        if (textareaComponent) {
            textareaComponent.updateLanguage(language);
        }
        if (tipsComponent) {
            tipsComponent.updateLanguage(language);
        }
        
        // 直接更新所有输入框的placeholder
        updateAllInputPlaceholders(componentElement, language, currentConfig);
        
        // 更新按钮文本
        updateAllButtonTexts(componentElement, language, currentConfig);

        // 强制更新所有可见标签
        forceUpdateAllTextLabels(componentElement, language);

    } catch (error) {
        languageUpdateLogger.error(`更新调试器组件语言时出错: ${error}`);
    }
}

/**
 * 更新行中的标签文本
 * @param row 表格行
 * @param text 要设置的文本
 */
function updateRowLabel(row: Element | null, text: string): void {
    if (!row) return;
    
    // 获取右侧单元格中的span标签
    const label = row.querySelector('td[align="right"] span:last-child');
    if (label) {
        label.textContent = text;
    }
}

/**
 * 更新行中的提示信息
 * @param row 表格行
 * @param tooltipText 提示文本
 */
function updateRowTooltip(row: Element | null, tooltipText: string): void {
    if (!row) return;
    
    // 获取提示元素
    const tooltip = row.querySelector('.js-script-hook-tooltip');
    if (tooltip) {
        tooltip.textContent = tooltipText;
    }
}

/**
 * 强制更新所有文本标签
 * 使用多种选择器查找所有可能的标签元素，确保语言切换时全部更新
 * @param componentElement 组件元素
 * @param language 语言配置
 */
function forceUpdateAllTextLabels(componentElement: HTMLElement, language: Language): void {
    if (!componentElement) return;

    // 1. 获取所有字段标签并根据内容标识它们
    const allLabelSpans = componentElement.querySelectorAll('td[align="right"] span');
    
    allLabelSpans.forEach(span => {
        const text = span.textContent?.trim() || '';
        
        // 根据文本内容或周围上下文识别并更新标签
        if (text.includes('Enable Request Breakpoint') || text.includes('是否开启请求断点')) {
            span.textContent = language.debugger_config.enableRequestDebugger;
        }
        else if (text.includes('Enable Response Breakpoint') || text.includes('是否开启响应断点')) {
            span.textContent = language.debugger_config.enableResponseDebugger;
        }
        else if (text.includes('JSONP Callback Function Parameter Name') || text.includes('jsonp回调函数参数名称')) {
            span.textContent = language.debugger_config.callbackFunctionParamName;
        }
        else if (text.includes('Comment') || text.includes('备注')) {
            span.textContent = language.debugger_config.comment;
        }
        else if (text.includes('Enable This Breakpoint') || text.includes('是否启用此断点')) {
            span.textContent = language.debugger_config.enable;
        }
        else if (text.includes('URL Matching Method') || text.includes('URL匹配方式')) {
            span.textContent = language.debugger_config.urlPattern;
        }
        else if (text.includes('Test') || text.includes('测试')) {
            span.textContent = language.debugger_config.urlPatternTest;
        }
    });
    
    // 2. 对于嵌套在表格行中的标签，使用行索引方法再次更新
    const rows = componentElement.querySelectorAll('.debugger-component-table tr');
    if (rows && rows.length > 0) {
        // 对关键行强制更新
        if (rows[4]) {
            updateRowLabel(rows[4], language.debugger_config.enableRequestDebugger);
        }
        if (rows[5]) {
            updateRowLabel(rows[5], language.debugger_config.enableResponseDebugger);
        }
        if (rows[6]) {
            updateRowLabel(rows[6], language.debugger_config.callbackFunctionParamName);
        }
        if (rows[7]) {
            updateRowLabel(rows[7], language.debugger_config.comment);
        }
    }
    
    // 3. 检查是否有特定ID的字段可以直接更新
    const requestLabel = componentElement.querySelector('#request-debugger-label');
    if (requestLabel) {
        requestLabel.textContent = language.debugger_config.enableRequestDebugger;
    }
    
    const responseLabel = componentElement.querySelector('#response-debugger-label');
    if (responseLabel) {
        responseLabel.textContent = language.debugger_config.enableResponseDebugger;
    }
    
    const callbackLabel = componentElement.querySelector('#callback-function-label');
    if (callbackLabel) {
        callbackLabel.textContent = language.debugger_config.callbackFunctionParamName;
    }
    
    const commentLabel = componentElement.querySelector('#comment-label');
    if (commentLabel) {
        commentLabel.textContent = language.debugger_config.comment;
    }
}

/**
 * 更新所有输入框的placeholder
 * @param componentElement 组件元素
 * @param language 语言配置
 * @param currentConfig 当前配置
 */
function updateAllInputPlaceholders(componentElement: HTMLElement, language: Language, currentConfig: DebuggerConfig): void {
    if (!componentElement) return;

    try {
        // 查找所有输入框并直接更新它们的placeholder
        const allInputs = componentElement.querySelectorAll('input[type="text"]');
        allInputs.forEach(input => {
            const inputEl = input as HTMLInputElement;
            const inputId = inputEl.id;
            
            // 根据输入框ID判断它是什么类型的输入框
            if (inputId && inputId.includes('url-pattern-text')) {
                inputEl.placeholder = language.debugger_config.urlPatternTextPlaceholder;
            } else if (inputId && inputId.includes('callback-function-param-name-text')) {
                inputEl.placeholder = language.debugger_config.callbackFunctionParamNamePlaceholder;
            }
        });

        // 查找URL匹配方式输入框并更新placeholder
        const urlPatternInput = componentElement.querySelector(`#${currentConfig.id}-url-pattern-text`) as HTMLInputElement;
        if (urlPatternInput) {
            urlPatternInput.placeholder = language.debugger_config.urlPatternTextPlaceholder;
        }

        // 查找回调函数参数名输入框并更新placeholder
        const callbackInput = componentElement.querySelector(`#${currentConfig.id}-callback-function-param-name-text`) as HTMLInputElement;
        if (callbackInput) {
            callbackInput.placeholder = language.debugger_config.callbackFunctionParamNamePlaceholder;
        }

        // 查找备注文本区域并更新placeholder
        const commentTextarea = componentElement.querySelector(`#${currentConfig.id}-comment-text`) as HTMLTextAreaElement;
        if (commentTextarea) {
            commentTextarea.placeholder = language.debugger_config.commentPlaceholder;
        }
        
        // 查找并直接通过DOM更新InputDialog中的placeholder
        const allDialogInputs = document.querySelectorAll('.js-script-hook-input-dialog-input');
        allDialogInputs.forEach(input => {
            const inputEl = input as HTMLInputElement;
            // 根据输入对话框的用途更新placeholder
            if (inputEl.placeholder && inputEl.placeholder.includes('Enter a keyword or expression')) {
                inputEl.placeholder = language.debugger_config.urlPatternTextPlaceholder;
            }
        });
    } catch (error) {
        languageUpdateLogger.error(`更新输入框placeholder时出错: ${error}`);
    }
}

/**
 * 更新所有按钮文本
 * @param componentElement 组件元素
 * @param language 语言配置
 * @param currentConfig 当前配置
 */
function updateAllButtonTexts(componentElement: HTMLElement, language: Language, currentConfig: DebuggerConfig): void {
    if (!componentElement) return;

    // 查找测试按钮并更新文本
    const testButton = componentElement.querySelector(`#${currentConfig.id}-url-pattern-test`) as HTMLButtonElement;
    if (testButton) {
        // 获取按钮内容区域（排除图标）
        const buttonTextSpan = testButton.querySelector('span:not(.js-script-hook-button-icon)');
        if (buttonTextSpan) {
            buttonTextSpan.textContent = language.debugger_config.urlPatternTest;
        } else {
            // 如果没有专门的文本区域，尝试直接更新按钮文本
            const iconElement = testButton.querySelector('.js-script-hook-button-icon');
            if (iconElement) {
                // 如果有图标，保留图标并更新其余部分
                const iconHTML = iconElement.outerHTML;
                testButton.innerHTML = iconHTML + language.debugger_config.urlPatternTest;
            } else {
                // 如果没有图标，直接更新全部内容
                testButton.textContent = language.debugger_config.urlPatternTest;
            }
        }
        // 更新按钮提示
        testButton.setAttribute('title', language.debugger_config.urlPatternTestTips);
    }

    // URL匹配测试按钮（另一种可能的实现）
    const altTestButton = componentElement.querySelector('.js-script-hook-url-pattern-test-btn');
    if (altTestButton) {
        altTestButton.textContent = language.debugger_config.urlPatternTest;
        altTestButton.setAttribute('title', language.debugger_config.urlPatternTestTips);
    }
} 