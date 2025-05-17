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
            updateRowLabel(rows[2], language.debugger_config.urlPatternKeyword);
            updateRowLabel(rows[3], language.debugger_config.urlPatternTest);
            updateRowLabel(rows[4], language.debugger_config.enableRequestDebugger);
            updateRowLabel(rows[5], language.debugger_config.enableResponseDebugger);
            updateRowLabel(rows[6], language.debugger_config.callbackFunctionParamName);
            updateRowLabel(rows[7], language.debugger_config.comment);
            
            // 不再需要直接更新提示信息，因为TipsComponent会处理这部分
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
        // tipsComponent由DebuggerComponent中的renderTipsComponents方法更新，无需在此处理
        
        // 直接更新所有输入框的placeholder
        updateAllInputPlaceholders(componentElement, language, currentConfig, inputComponent);
        
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
    
    // 获取右侧单元格中的标签文本元素
    const label = row.querySelector('td[align="right"] .label-text');
    if (label) {
        label.textContent = text;
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

    // 获取所有字段标签并根据内容标识它们
    const allLabelSpans = componentElement.querySelectorAll('td[align="right"] .label-text');
    
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
}

/**
 * 更新所有输入框的placeholder
 * @param componentElement 组件元素
 * @param language 语言配置
 * @param currentConfig 当前配置
 */
function updateAllInputPlaceholders(componentElement: HTMLElement, language: Language, currentConfig: DebuggerConfig, inputComponent?: any): void {
    if (!componentElement) return;

    try {
        languageUpdateLogger.debug(`正在更新所有输入框的placeholder，调试器ID: ${currentConfig.id}`);
        
        // 查找所有输入框并直接更新它们的placeholder
        const allInputs = componentElement.querySelectorAll('input[type="text"]');
        allInputs.forEach(input => {
            const inputEl = input as HTMLInputElement;
            const inputId = inputEl.id;
            
            // 根据输入框ID判断它是什么类型的输入框
            if (inputId && inputId.includes('url-pattern-text')) {
                inputEl.placeholder = language.debugger_config.urlPatternTextPlaceholder;
                languageUpdateLogger.debug(`更新URL匹配方式输入框placeholder为: ${language.debugger_config.urlPatternTextPlaceholder}`);
            } else if (inputId && inputId.includes('callback-function-param-name-text')) {
                inputEl.placeholder = language.debugger_config.callbackFunctionParamNamePlaceholder;
                languageUpdateLogger.debug(`更新回调函数参数名输入框placeholder为: ${language.debugger_config.callbackFunctionParamNamePlaceholder}`);
            }
        });

        // 查找URL匹配方式输入框并更新placeholder
        const urlPatternInput = componentElement.querySelector(`#${currentConfig.id}-url-pattern-text`) as HTMLInputElement;
        if (urlPatternInput) {
            // 根据输入框是否禁用设置不同的占位符文本
            if (urlPatternInput.disabled || currentConfig.urlPatternType === 'match-all') {
                urlPatternInput.placeholder = language.debugger_config.urlPatternMatchAllDisabledText;
                languageUpdateLogger.debug(`URL匹配方式输入框为禁用状态，更新placeholder为: ${language.debugger_config.urlPatternMatchAllDisabledText}`);
            } else {
                urlPatternInput.placeholder = language.debugger_config.urlPatternTextPlaceholder;
                languageUpdateLogger.debug(`更新URL匹配方式输入框placeholder为: ${language.debugger_config.urlPatternTextPlaceholder}`);
            }
            
            // 如果有提供InputComponent实例，使用其setPlaceholder方法更新
            if (inputComponent) {
                const inputCompInstance = inputComponent;
                // 使用setTimeout确保DOM操作完成后再调用
                setTimeout(() => {
                    if (urlPatternInput.disabled || currentConfig.urlPatternType === 'match-all') {
                        inputCompInstance.setPlaceholder(language.debugger_config.urlPatternMatchAllDisabledText);
                        languageUpdateLogger.debug(`通过InputComponent更新禁用状态的URL匹配方式输入框placeholder为: ${language.debugger_config.urlPatternMatchAllDisabledText}`);
                    } else {
                        inputCompInstance.setPlaceholder(language.debugger_config.urlPatternTextPlaceholder);
                        languageUpdateLogger.debug(`通过InputComponent更新URL匹配方式输入框placeholder为: ${language.debugger_config.urlPatternTextPlaceholder}`);
                    }
                }, 0);
            }
        }

        // 查找回调函数参数名输入框并更新placeholder
        const callbackInput = componentElement.querySelector(`#${currentConfig.id}-callback-function-param-name-text`) as HTMLInputElement;
        if (callbackInput) {
            callbackInput.placeholder = language.debugger_config.callbackFunctionParamNamePlaceholder;
            
            // 如果有提供InputComponent实例，使用其setPlaceholder方法更新
            if (inputComponent) {
                const inputCompInstance = inputComponent;
                // 使用setTimeout确保DOM操作完成后再调用
                setTimeout(() => {
                    inputCompInstance.setPlaceholder(language.debugger_config.callbackFunctionParamNamePlaceholder);
                    languageUpdateLogger.debug(`通过InputComponent更新回调函数参数名输入框placeholder为: ${language.debugger_config.callbackFunctionParamNamePlaceholder}`);
                }, 0);
            }
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
            if (inputEl.placeholder && (inputEl.placeholder.includes('Enter a keyword or expression') || inputEl.placeholder.includes('输入关键字或者表达式'))) {
                inputEl.placeholder = language.debugger_config.urlPatternTextPlaceholder;
                languageUpdateLogger.debug(`更新对话框输入框placeholder为: ${language.debugger_config.urlPatternTextPlaceholder}`);
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