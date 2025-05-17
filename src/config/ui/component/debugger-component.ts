import { getGlobalConfig } from "../../config";
import { DebuggerTester } from "../../../debugger/debugger-tester";
import { ScriptContext } from "../../../context/script/script-context";
import { 
    SelectComponent, 
    SelectOption, 
    ConfirmDialogComponent,
    InputComponent,
    CheckboxComponent,
    CheckboxType,
    ButtonComponent,
    ButtonType,
    ButtonSize,
    TextareaComponent,
    InputDialogComponent,
    AlertDialogComponent
} from './basic';
import { createLogger } from '../../../logger';
import { Language } from './language';
import { LanguageUpdateable } from './language-updateable';
import { LanguageEventManager } from './language-event-manager';

// 创建DebuggerComponent专用的日志记录器
const debuggerCompLogger = createLogger('debugger-component');

type UrlPatternType = 'equals-string' | 'contains-string' | 'match-regexp' | 'match-all';
type HookType = 'redeclare' | 'proxy';

export interface DebuggerConfig {
    id: string;
    enable: boolean;
    urlPattern: string;
    urlPatternType: UrlPatternType;
    hookType: HookType;
    enableRequestDebugger: boolean;
    enableResponseDebugger: boolean;
    comment: string;
    callbackFunctionName: string;
}

/**
 * 用于表示一个断点配置
 */
export class DebuggerComponent implements LanguageUpdateable {
    private selectComponent: SelectComponent;
    private inputComponent: InputComponent;
    private checkboxComponent: CheckboxComponent;
    private buttonComponent: ButtonComponent;
    private textareaComponent: TextareaComponent;
    private readonly styleCSS: string;
    private readonly componentId: string;
    private currentLanguage: Language | undefined;
    private currentConfig: DebuggerConfig | undefined;
    private componentElement: HTMLElement | null = null;
    
    constructor() {
        this.componentId = 'debugger-component-' + Math.random().toString(36).substring(2, 10);
        this.selectComponent = new SelectComponent();
        this.inputComponent = new InputComponent();
        this.checkboxComponent = new CheckboxComponent();
        this.buttonComponent = new ButtonComponent();
        this.textareaComponent = new TextareaComponent();
        
        this.styleCSS = `
        .debugger-component-fieldset {
            width: 780px;
            border: 1px solid #ddd;
            border-radius: 6px;
            margin: 15px 0;
            padding: 15px;
            position: relative;
            background-color: #fcfcfc;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            transition: box-shadow 0.2s ease;
        }
        
        .debugger-component-fieldset:hover {
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .debugger-component-legend {
            color: #666;
            font-weight: 500;
            padding: 0 10px;
            font-size: 14px;
        }
        
        .debugger-component-remove-btn {
            position: absolute;
            right: 10px;
            top: 10px;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #aaa;
            background-color: white;
            border-radius: 50%;
            font-size: 14px;
            color: #888;
            cursor: pointer;
            transition: all 0.2s ease;
            opacity: 0.7;
        }
        
        .debugger-component-remove-btn:hover {
            color: #555;
            background-color: #f5f5f5;
            border-color: #777;
            opacity: 1;
        }

        .debugger-component-table {
            width: 100%;
            border-spacing: 0;
        }
        
        .debugger-component-table td {
            padding: 8px;
            vertical-align: middle;
        }
        
        .debugger-component-table td[align="right"] {
            width: 200px;
            text-align: right;
            padding-right: 15px;
        }
        
        .debugger-component-table td[align="left"] {
            text-align: left;
            padding-left: 15px;
        }
        `;
        
        this.appendStyles();
        
        // 订阅语言更新事件
        LanguageEventManager.getInstance().subscribe(this.componentId, this.updateLanguage.bind(this));
    }
    
    /**
     * 添加组件样式到页面中
     */
    private appendStyles(): void {
        // 避免重复插入
        if (document.getElementById("debugger-component-style")) {
            return;
        }

        // 创建一个 <style> 元素
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "debugger-component-style";
        
        // 将 CSS 规则添加到 <style> 元素
        style.appendChild(document.createTextNode(this.styleCSS));
        
        // 将 <style> 元素插入到 <head> 中
        document.head.appendChild(style);
    }
    
    /**
     * 构造初始的模板
     *
     * @param language 语言配置
     * @param debuggerConfig 断点配置
     * @return 模板字符串
     */
    private template(language: Language, debuggerConfig: DebuggerConfig): string {
        return `
<fieldset id="${debuggerConfig.id}" class="debugger-component-fieldset">      
    <legend class="debugger-component-legend">${language.debugger_config.debuggerTitle}-${debuggerConfig.id}</legend>          
    <button id="${debuggerConfig.id}-remove-btn" class="debugger-component-remove-btn" title="${language.confirm_dialog.deleteBreakpoint}">
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
                <span>${language.debugger_config.enable} </span>
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
            <td align="left">
                <div style="border: 1px solid #DDD; padding: 10px; width: 480px; border-radius: 5px; background-color: #f9f9f9;"> 
                    <div style="display: inline-block;">
                        <div class="js-script-hook-tips-icon" >
                            ?
                            <div class="js-script-hook-tooltip">
                            ${language.debugger_config.urlPatternTypeTips}
                            </div>
                        </div>
                        <div id="${debuggerConfig.id}-url-pattern-container" style="display: inline-block; width: 380px;"></div>
                    </div>
                   <div>
                        <div class="js-script-hook-tips-icon" >
                            ?
                            <div class="js-script-hook-tooltip">
                            ${language.debugger_config.urlPatternTextTips}
                            </div>
                        </div>
                        <div id="${debuggerConfig.id}-url-pattern-text-container" style="display: inline-block; width: 380px;"></div>
                    </div>
                    <div>
                       <div class="js-script-hook-tips-icon">
                            ?
                            <div class="js-script-hook-tooltip">
                            ${language.debugger_config.urlPatternTestTips}
                            </div>
                        </div>
                        <div id="${debuggerConfig.id}-url-pattern-test-container"></div>
                    </div>
               </div>
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
            <td align="left" id="${debuggerConfig.id}-enableRequestDebugger-checkbox-container">
                <!-- 复选框组件将在render方法中添加 -->
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
                <span> ${language.debugger_config.enableResponseDebugger} </span>
            </td>
            <td align="left" id="${debuggerConfig.id}-enableResponseDebugger-checkbox-container">
                <!-- 复选框组件将在render方法中添加 -->
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
                <span> ${language.debugger_config.callbackFunctionParamName} </span>
            </td>
            <td align="left" id="${debuggerConfig.id}-callbackFunctionParamName-container">
                <!-- 输入框组件将在render方法中添加 -->
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
                <span> ${language.debugger_config.comment} </span>
            </td>
            <td align="left" id="${debuggerConfig.id}-comment-container">
                <!-- 文本区域组件将在render方法中添加 -->
            </td>
        </tr>
    </table>
</fieldset>
        `;
    }

    /**
     * 渲染断点组件
     * @param language 语言配置
     * @param debuggerInformation 断点信息
     * @returns HTMLElement
     */
    public render(language: Language, debuggerInformation: DebuggerConfig): HTMLElement {
        this.currentLanguage = language;
        this.currentConfig = debuggerInformation;
        
        // 添加组件样式
        this.appendStyles();

        // 创建临时容器
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = this.template(language, debuggerInformation);
        this.componentElement = tempContainer.firstElementChild as HTMLElement;

        // 绑定事件处理
        this.bindEvents(this.componentElement, language, debuggerInformation);

        return this.componentElement;
    }

    /**
     * 实现LanguageUpdateable接口
     */
    public getComponentId(): string {
        return this.componentId;
    }

    /**
     * 更新组件的语言
     * @param language 新的语言配置
     */
    public updateLanguage(language: Language): void {
        if (!this.componentElement || !this.currentConfig) {
            return;
        }

        try {
            this.currentLanguage = language;
            
            // 更新标题
            const legend = this.componentElement.querySelector('.debugger-component-legend');
            if (legend) {
                legend.textContent = language.debugger_config.debuggerTitle;
            }

            // 更新表格内容
            const table = this.componentElement.querySelector('.debugger-component-table');
            if (table) {
                const rows = table.querySelectorAll('tr');
                
                // 更新启用断点行
                const enableRow = rows[0];
                if (enableRow) {
                    const label = enableRow.querySelector('td[align="right"]');
                    if (label) {
                        label.textContent = language.debugger_config.enable;
                    }
                }

                // 更新URL匹配方式行
                const urlPatternRow = rows[1];
                if (urlPatternRow) {
                    const label = urlPatternRow.querySelector('td[align="right"]');
                    if (label) {
                        label.textContent = language.debugger_config.urlPattern;
                    }
                }

                // 更新请求断点行
                const requestDebuggerRow = rows[2];
                if (requestDebuggerRow) {
                    const label = requestDebuggerRow.querySelector('td[align="right"]');
                    if (label) {
                        label.textContent = language.debugger_config.enableRequestDebugger;
                    }
                }

                // 更新响应断点行
                const responseDebuggerRow = rows[3];
                if (responseDebuggerRow) {
                    const label = responseDebuggerRow.querySelector('td[align="right"]');
                    if (label) {
                        label.textContent = language.debugger_config.enableResponseDebugger;
                    }
                }

                // 更新回调函数参数名行
                const callbackFunctionRow = rows[4];
                if (callbackFunctionRow) {
                    const label = callbackFunctionRow.querySelector('td[align="right"]');
                    if (label) {
                        label.textContent = language.debugger_config.callbackFunctionParamName;
                    }
                }

                // 更新备注行
                const commentRow = rows[5];
                if (commentRow) {
                    const label = commentRow.querySelector('td[align="right"]');
                    if (label) {
                        label.textContent = language.debugger_config.comment;
                    }
                }
            }

            // 更新子组件的语言
            if ('updateLanguage' in this.selectComponent) {
                (this.selectComponent as unknown as LanguageUpdateable).updateLanguage(language);
            }
            if ('updateLanguage' in this.inputComponent) {
                (this.inputComponent as unknown as LanguageUpdateable).updateLanguage(language);
            }
            if ('updateLanguage' in this.checkboxComponent) {
                (this.checkboxComponent as unknown as LanguageUpdateable).updateLanguage(language);
            }
            if ('updateLanguage' in this.buttonComponent) {
                (this.buttonComponent as unknown as LanguageUpdateable).updateLanguage(language);
            }
            if ('updateLanguage' in this.textareaComponent) {
                (this.textareaComponent as unknown as LanguageUpdateable).updateLanguage(language);
            }
        } catch (error) {
            debuggerCompLogger.error(`更新断点配置组件语言时出错: ${error}`);
        }
    }

    /**
     * 组件销毁时取消订阅
     */
    public destroy(): void {
        LanguageEventManager.getInstance().unsubscribe(this.componentId);
        
        // 销毁子组件
        if ('destroy' in this.selectComponent) {
            (this.selectComponent as unknown as LanguageUpdateable).destroy();
        }
        if ('destroy' in this.inputComponent) {
            (this.inputComponent as unknown as LanguageUpdateable).destroy();
        }
        if ('destroy' in this.checkboxComponent) {
            (this.checkboxComponent as unknown as LanguageUpdateable).destroy();
        }
        if ('destroy' in this.buttonComponent) {
            (this.buttonComponent as unknown as LanguageUpdateable).destroy();
        }
        if ('destroy' in this.textareaComponent) {
            (this.textareaComponent as unknown as LanguageUpdateable).destroy();
        }
    }

    /**
     * 绑定事件处理
     * @param element 组件元素
     * @param language 语言配置
     * @param debuggerInformation 断点配置信息
     */
    private bindEvents(element: HTMLElement, language: Language, debuggerInformation: DebuggerConfig): void {
        // 绑定删除事件
        const removeBtn = element.querySelector(`#${debuggerInformation.id}-remove-btn`);
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
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
                            element.remove();
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
                this.checkboxComponent.render(
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

        const enableRequestDebuggerContainer = element.querySelector(`#${debuggerInformation.id}-enableRequestDebugger-checkbox-container`);
        if (enableRequestDebuggerContainer) {
            enableRequestDebuggerContainer.appendChild(
                this.checkboxComponent.render(
                    `${debuggerInformation.id}-enableRequestDebugger-checkbox`,
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
        
        const enableResponseDebuggerContainer = element.querySelector(`#${debuggerInformation.id}-enableResponseDebugger-checkbox-container`);
        if (enableResponseDebuggerContainer) {
            enableResponseDebuggerContainer.appendChild(
                this.checkboxComponent.render(
                    `${debuggerInformation.id}-enableResponseDebugger-checkbox`,
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
                this.buttonComponent.render(
                    `${debuggerInformation.id}-url-pattern-test`,
                    language.debugger_config.urlPatternTest,
                    function() {
                        const inputDialog = InputDialogComponent.getInstance();
                        inputDialog.show(
                            language.debugger_config.urlPatternTest,
                            language.debugger_config.urlPatternTestPrompt,
                            (confirmed: boolean, url: string) => {
                                if (!confirmed || !url) return;
                                
                                try {
                                    const dummyContext = new ScriptContext(url, null, null);
                                    const tester = new DebuggerTester();
                                    const result = tester.testUrl(debuggerInformation.urlPatternType, debuggerInformation.urlPattern, url);
                                    
                                    const resultDialog = AlertDialogComponent.getInstance();
                                    const resultText = `${language.debugger_config.urlPatternTestResult} ${result ? '✓' : '✗'}`;
                                    resultDialog.show('URL Pattern Test', resultText);
                                } catch (e: unknown) {
                                    console.error('Error testing URL pattern:', e);
                                    const errorDialog = AlertDialogComponent.getInstance();
                                    const errorMessage = e instanceof Error ? e.message : String(e);
                                    errorDialog.show('Error', `Test failed: ${errorMessage}`);
                                }
                            },
                            'https://example.com/api/data.js'
                        );
                    },
                    'primary',
                    'small',
                    '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4M12 8h.01"></path></svg>'
                )
            );
        }

        // 为URL pattern输入绑定事件
        const urlPatternTextContainer = element.querySelector(`#${debuggerInformation.id}-url-pattern-text-container`);
        if (urlPatternTextContainer) {
            urlPatternTextContainer.appendChild(
                this.inputComponent.render(
                    `${debuggerInformation.id}-url-pattern-text`,
                    debuggerInformation.urlPattern || '',
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
        const callbackFunctionParamNameContainer = element.querySelector(`#${debuggerInformation.id}-callbackFunctionParamName-container`);
        if (callbackFunctionParamNameContainer) {
            callbackFunctionParamNameContainer.appendChild(
                this.inputComponent.render(
                    `${debuggerInformation.id}-callbackFunctionParamName-text`,
                    debuggerInformation.callbackFunctionName || '',
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
            commentContainer.appendChild(
                this.textareaComponent.render(
                    `${debuggerInformation.id}-comment-text`,
                    debuggerInformation.comment || '',
                    language.debugger_config.commentPlaceholder,
                    undefined,
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
                    5,
                    undefined
                )
            );
        }
        
        // 在DOM准备好后渲染SelectComponent
        setTimeout(() => {
            const selectContainer = element.querySelector(`#${debuggerInformation.id}-url-pattern-container`);
            if (selectContainer) {
                const urlPatternOptions: SelectOption[] = [
                    { value: 'equals-string', text: language.debugger_config.urlPatternType_EqualsThisString },
                    { value: 'contains-string', text: language.debugger_config.urlPatternType_ContainsThisString },
                    { value: 'match-regexp', text: language.debugger_config.urlPatternType_MatchThisRegexp },
                    { value: 'match-all', text: language.debugger_config.urlPatternType_MatchALL }
                ];
                
                selectContainer.appendChild(
                    this.selectComponent.render(
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
} 