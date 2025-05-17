import { getGlobalConfig } from "../../../config";
import { DebuggerConfig, UrlPatternType } from './types';
import { Language } from '../language';
import { 
    SelectComponent, 
    SelectOption,
    ConfirmDialogComponent,
    InputComponent,
    CheckboxComponent,
    ButtonComponent,
    TextareaComponent,
    InputDialogComponent,
    AlertDialogComponent
} from '../basic';
import { ScriptContext } from "../../../../context/script/script-context";
import { DebuggerTester } from "../../../../debugger/debugger-tester";
import { createLogger } from "../../../../logger";

const eventsLogger = createLogger('debugger-events');

/**
 * 为调试器组件绑定事件处理
 * @param element 组件元素
 * @param language 语言配置
 * @param debuggerInformation 断点配置信息
 * @param dependencies 依赖的组件实例
 * @param destroy 组件销毁方法
 */
export function bindDebuggerEvents(
    element: HTMLElement, 
    language: Language, 
    debuggerInformation: DebuggerConfig,
    dependencies: {
        selectComponent: SelectComponent,
        inputComponent: InputComponent,
        checkboxComponent: CheckboxComponent,
        buttonComponent: ButtonComponent,
        textareaComponent: TextareaComponent
    },
    destroy: () => void
): void {
    // 解构依赖
    const { selectComponent, inputComponent, checkboxComponent, buttonComponent, textareaComponent } = dependencies;
    
    // 绑定删除事件
    const removeButton = element.querySelector(`#${debuggerInformation.id}-remove-btn`);
    if (removeButton) {
        removeButton.addEventListener('click', () => {
            const confirmDialog = ConfirmDialogComponent.getInstance();
            confirmDialog.show(
                language.confirm_dialog.deleteBreakpoint,
                language.confirm_dialog.deleteConfirmMessage,
                (confirmed: boolean) => {
                    if (confirmed) {
                        // 确认删除
                        const config = getGlobalConfig();
                        config.removeDebuggerById(debuggerInformation.id);
                        config.persist();
                        // 销毁组件并清理资源
                        destroy();
                    }
                },
                language.confirm_dialog.okButton,
                language.confirm_dialog.cancelButton
            );
        });
    }

    // 为checkbox绑定事件
    const enableCheckboxContainer = element.querySelector(`#${debuggerInformation.id}-enable-checkbox-container`);
    if (enableCheckboxContainer) {
        enableCheckboxContainer.appendChild(
            checkboxComponent.render(
                `${debuggerInformation.id}-enable-checkbox`,
                debuggerInformation.enable,
                (isChecked: boolean) => {
                    debuggerInformation.enable = isChecked;
                    
                    // 保存配置
                    const config = getGlobalConfig();
                    const debuggerItem = config.findDebuggerById(debuggerInformation.id);
                    if (debuggerItem) {
                        debuggerItem.enable = isChecked;
                        debuggerItem.updateTime = new Date().getTime();
                        config.persist();
                    }
                }
            )
        );
    }

    const enableRequestDebuggerContainer = element.querySelector(`#${debuggerInformation.id}-enable-request-debugger-container`);
    if (enableRequestDebuggerContainer) {
        enableRequestDebuggerContainer.appendChild(
            checkboxComponent.render(
                `${debuggerInformation.id}-enable-request-debugger-checkbox`,
                debuggerInformation.enableRequestDebugger,
                (isChecked: boolean) => {
                    debuggerInformation.enableRequestDebugger = isChecked;
                    
                    // 保存配置
                    const config = getGlobalConfig();
                    const debuggerItem = config.findDebuggerById(debuggerInformation.id);
                    if (debuggerItem) {
                        debuggerItem.enableRequestDebugger = isChecked;
                        debuggerItem.updateTime = new Date().getTime();
                        config.persist();
                    }
                }
            )
        );
    }
    
    const enableResponseDebuggerContainer = element.querySelector(`#${debuggerInformation.id}-enable-response-debugger-container`);
    if (enableResponseDebuggerContainer) {
        enableResponseDebuggerContainer.appendChild(
            checkboxComponent.render(
                `${debuggerInformation.id}-enable-response-debugger-checkbox`,
                debuggerInformation.enableResponseDebugger,
                (isChecked: boolean) => {
                    debuggerInformation.enableResponseDebugger = isChecked;
                    
                    // 保存配置
                    const config = getGlobalConfig();
                    const debuggerItem = config.findDebuggerById(debuggerInformation.id);
                    if (debuggerItem) {
                        debuggerItem.enableResponseDebugger = isChecked;
                        debuggerItem.updateTime = new Date().getTime();
                        config.persist();
                    }
                }
            )
        );
    }

    // 为URL模式测试按钮绑定事件
    const urlPatternTestContainer = element.querySelector(`#${debuggerInformation.id}-url-pattern-test-container`);
    if (urlPatternTestContainer) {
        urlPatternTestContainer.appendChild(
            buttonComponent.render(
                `${debuggerInformation.id}-url-pattern-test`,
                language.debugger_config.urlPatternTest,
                function() {
                    const inputDialog = InputDialogComponent.getInstance();
                    inputDialog.show(
                        language.debugger_config.urlPatternTestPrompt,
                        '',
                        (confirmed: boolean, testUrl: string) => {
                            if (!confirmed || !testUrl) return;
                            
                            try {
                                const dummyContext = new ScriptContext(testUrl, null, null);
                                const tester = new DebuggerTester();
                                const result = tester.testUrl(debuggerInformation.urlPatternType, debuggerInformation.urlPattern, testUrl);
                                
                                const alertDialog = AlertDialogComponent.getInstance();
                                alertDialog.show(
                                    language.debugger_config.urlPatternTestResult,
                                    result ? '✅ Match' : '❌ Not Match',
                                    language.basic.closeButton
                                );
                            } catch (e: unknown) {
                                eventsLogger.error(`测试URL匹配模式时出错: ${e}`);
                            }
                        },
                        '',
                        language.debugger_config.urlPatternTextPlaceholder,
                        language.basic.testButton,
                        language.basic.cancelButton
                    );
                },
                'primary',
                'small',
                '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4M12 8h.01"></path></svg>'
            )
        );
    }

    // 为URL pattern输入绑定事件
    const urlPatternTextContainer = element.querySelector(`#${debuggerInformation.id}-url-pattern-input-container`);
    if (urlPatternTextContainer) {
        urlPatternTextContainer.appendChild(
            inputComponent.render(
                `${debuggerInformation.id}-url-pattern-text`,
                debuggerInformation.urlPattern,
                language.debugger_config.urlPatternTextPlaceholder,
                undefined,
                (value: string) => {
                    debuggerInformation.urlPattern = value;
                    
                    // 保存配置
                    const config = getGlobalConfig();
                    const debuggerItem = config.findDebuggerById(debuggerInformation.id);
                    if (debuggerItem) {
                        debuggerItem.urlPattern = value;
                        debuggerItem.updateTime = new Date().getTime();
                        config.persist();
                    }
                }
            )
        );
    }

    // 为callback函数名绑定事件
    const callbackFunctionParamNameContainer = element.querySelector(`#${debuggerInformation.id}-callback-function-param-name-container`);
    if (callbackFunctionParamNameContainer) {
        callbackFunctionParamNameContainer.appendChild(
            inputComponent.render(
                `${debuggerInformation.id}-callback-function-param-name-text`,
                debuggerInformation.callbackFunctionName,
                language.debugger_config.callbackFunctionParamNamePlaceholder,
                undefined,
                (value: string) => {
                    debuggerInformation.callbackFunctionName = value;
                    
                    // 保存配置
                    const config = getGlobalConfig();
                    const debuggerItem = config.findDebuggerById(debuggerInformation.id);
                    if (debuggerItem) {
                        debuggerItem.callbackFunctionName = value;
                        debuggerItem.updateTime = new Date().getTime();
                        config.persist();
                    }
                }
            )
        );
    }

    // 为comment绑定事件
    const commentContainer = element.querySelector(`#${debuggerInformation.id}-comment-container`);
    if (commentContainer) {
        // 创建新的TextareaComponent实例用于评论
        const commentTextarea = new TextareaComponent(
            `${debuggerInformation.id}-comment-text`,
            language.debugger_config.comment, 
            language.debugger_config.commentPlaceholder,
            debuggerInformation.comment || '',
            (value: string) => {
                debuggerInformation.comment = value;
                
                // 保存配置
                const config = getGlobalConfig();
                const debuggerItem = config.findDebuggerById(debuggerInformation.id);
                if (debuggerItem) {
                    debuggerItem.comment = value;
                    debuggerItem.updateTime = new Date().getTime();
                    config.persist();
                }
            },
            undefined,
            true
        );
        commentContainer.appendChild(commentTextarea.getDomElement());
    }
    
    // 在DOM准备好后渲染SelectComponent
    setTimeout(() => {
        const selectContainer = element.querySelector(`#${debuggerInformation.id}-url-pattern-type-container`);
        if (selectContainer) {
            const urlPatternOptions: SelectOption[] = [
                { value: 'equals-string', text: language.debugger_config.urlPatternType_EqualsThisString },
                { value: 'contains-string', text: language.debugger_config.urlPatternType_ContainsThisString },
                { value: 'match-regexp', text: language.debugger_config.urlPatternType_MatchThisRegexp },
                { value: 'match-all', text: language.debugger_config.urlPatternType_MatchALL }
            ];
            
            selectContainer.appendChild(
                selectComponent.render(
                    `${debuggerInformation.id}-url-pattern`,
                    urlPatternOptions,
                    debuggerInformation.urlPatternType || 'match-all',
                    undefined,
                    (value: string) => {
                        if (value === 'equals-string' || value === 'contains-string' || 
                            value === 'match-regexp' || value === 'match-all') {
                            debuggerInformation.urlPatternType = value as UrlPatternType;
                            // 保存配置
                            const config = getGlobalConfig();
                            const debuggerItem = config.findDebuggerById(debuggerInformation.id);
                            if (debuggerItem) {
                                debuggerItem.urlPatternType = debuggerInformation.urlPatternType;
                                debuggerItem.updateTime = new Date().getTime();
                                config.persist();
                            }
                        }
                    }
                )
            );
        }
    }, 0);
} 