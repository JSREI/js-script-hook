import $ from 'jquery';
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

type UrlPatternType = 'equals-string' | 'contains-string' | 'match-regexp' | 'match-all';
type HookType = 'redeclare' | 'proxy';

export interface Language {
    debugger_config: {
        debuggerTitle: string;
        enableTips: string;
        enable: string;
        urlPatternTips: string;
        urlPattern: string;
        urlPatternTypeTips: string;
        urlPatternType_EqualsThisString: string;
        urlPatternType_ContainsThisString: string;
        urlPatternType_MatchThisRegexp: string;
        urlPatternType_MatchALL: string;
        urlPatternTextTips: string;
        urlPatternTextPlaceholder: string;
        urlPatternTestTips: string;
        urlPatternTest: string;
        urlPatternTestPrompt: string;
        urlPatternTestResult: string;
        enableRequestDebuggerTips: string;
        enableRequestDebugger: string;
        enableResponseDebuggerTips: string;
        enableResponseDebugger: string;
        callbackFunctionParamNameTips: string;
        callbackFunctionParamName: string;
        callbackFunctionParamNamePlaceholder: string;
        commentTips: string;
        comment: string;
        commentPlaceholder: string;
    };
    global_settings: {
        title: string;
        languageTips: string;
        language: string;
        responseDebuggerHookTypeTips: string;
        responseDebuggerHookType: string;
        responseDebuggerHookTypeUseProxyFunction: string;
        responseDebuggerHookTypeUseRedeclareFunction: string;
        flagPrefixTips: string;
        flagPrefix: string;
        flagPrefixPlaceholder: string;
        isIgnoreJsSuffixRequestTips: string;
        isIgnoreJsSuffixRequest: string;
        isIgnoreNotJsonpRequestTips: string;
        isIgnoreNotJsonpRequest: string;
    };
    tabs: {
        debuggerListTab: string;
        globalSettingsTab: string;
        addNewBreakpoint?: string;
    };
    confirm_dialog: {
        deleteBreakpoint: string;
        deleteConfirmMessage: string;
        okButton: string;
        cancelButton: string;
    };
}

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
export class DebuggerComponent {
    private selectComponent: SelectComponent;
    private inputComponent: InputComponent;
    private checkboxComponent: CheckboxComponent;
    private buttonComponent: ButtonComponent;
    private textareaComponent: TextareaComponent;
    private readonly styleCSS: string;
    
    constructor() {
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
     * 渲染一条断点规则
     *
     * @param language 语言配置
     * @param debuggerInformation 断点信息
     * @return jQuery对象
     */
    public render(language: Language, debuggerInformation: DebuggerConfig): JQuery<HTMLElement> {
        // 添加样式
        this.appendStyles();
        
        const $debuggerComponent = $(this.template(language, debuggerInformation));

        // 绑定事件
        const localDebuggerInformation = { ...debuggerInformation };

        // 添加复选框组件 - 启用/禁用断点
        $debuggerComponent.find(`#${debuggerInformation.id}-enable-checkbox-container`).append(
            this.checkboxComponent.render(
                `${debuggerInformation.id}-enable-checkbox`,
                debuggerInformation.enable,
                (isChecked: boolean) => {
                    localDebuggerInformation.enable = isChecked;
                    // 保存配置
                    const config = getGlobalConfig();
                    const debuggerItem = config.findDebuggerById(localDebuggerInformation.id);
                    if (debuggerItem) {
                        debuggerItem.enable = localDebuggerInformation.enable;
                        debuggerItem.updateTime = new Date().getTime();
                        config.persist();
                    }
                }
            )
        );

        // 添加输入框组件 - URL匹配文本
        $debuggerComponent.find(`#${debuggerInformation.id}-url-pattern-text-container`).append(
            this.inputComponent.render(
                `${debuggerInformation.id}-url-pattern-text`,
                debuggerInformation.urlPattern || '',
                language.debugger_config.urlPatternTextPlaceholder,
                undefined,
                (value: string) => {
                    localDebuggerInformation.urlPattern = value;
                    // 保存配置
                    const config = getGlobalConfig();
                    const debuggerItem = config.findDebuggerById(localDebuggerInformation.id);
                    if (debuggerItem) {
                        debuggerItem.urlPattern = localDebuggerInformation.urlPattern;
                        debuggerItem.updateTime = new Date().getTime();
                        config.persist();
                    }
                }
            )
        );

        // 添加复选框组件 - 启用请求断点
        $debuggerComponent.find(`#${debuggerInformation.id}-enableRequestDebugger-checkbox-container`).append(
            this.checkboxComponent.render(
                `${debuggerInformation.id}-enableRequestDebugger-checkbox`,
                debuggerInformation.enableRequestDebugger,
                (isChecked: boolean) => {
                    localDebuggerInformation.enableRequestDebugger = isChecked;
                    // 保存配置
                    const config = getGlobalConfig();
                    const debuggerItem = config.findDebuggerById(localDebuggerInformation.id);
                    if (debuggerItem) {
                        debuggerItem.enableRequestDebugger = localDebuggerInformation.enableRequestDebugger;
                        debuggerItem.updateTime = new Date().getTime();
                        config.persist();
                    }
                }
            )
        );

        // 添加复选框组件 - 启用响应断点
        $debuggerComponent.find(`#${debuggerInformation.id}-enableResponseDebugger-checkbox-container`).append(
            this.checkboxComponent.render(
                `${debuggerInformation.id}-enableResponseDebugger-checkbox`,
                debuggerInformation.enableResponseDebugger,
                (isChecked: boolean) => {
                    localDebuggerInformation.enableResponseDebugger = isChecked;
                    // 保存配置
                    const config = getGlobalConfig();
                    const debuggerItem = config.findDebuggerById(localDebuggerInformation.id);
                    if (debuggerItem) {
                        debuggerItem.enableResponseDebugger = localDebuggerInformation.enableResponseDebugger;
                        debuggerItem.updateTime = new Date().getTime();
                        config.persist();
                    }
                }
            )
        );

        // 添加输入框组件 - 回调函数参数名
        $debuggerComponent.find(`#${debuggerInformation.id}-callbackFunctionParamName-container`).append(
            this.inputComponent.render(
                `${debuggerInformation.id}-callbackFunctionParamName-text`,
                debuggerInformation.callbackFunctionName || '',
                language.debugger_config.callbackFunctionParamNamePlaceholder,
                undefined,
                (value: string) => {
                    localDebuggerInformation.callbackFunctionName = value;
                    // 保存配置
                    const config = getGlobalConfig();
                    const debuggerItem = config.findDebuggerById(localDebuggerInformation.id);
                    if (debuggerItem) {
                        debuggerItem.callbackFunctionName = localDebuggerInformation.callbackFunctionName;
                        debuggerItem.updateTime = new Date().getTime();
                        config.persist();
                    }
                }
            )
        );

        // 添加文本区域组件 - 备注
        $debuggerComponent.find(`#${debuggerInformation.id}-comment-container`).append(
            this.textareaComponent.render(
                `${debuggerInformation.id}-comment-text`,
                debuggerInformation.comment || '',
                language.debugger_config.commentPlaceholder,
                undefined, // 无标签
                (value: string) => {
                    localDebuggerInformation.comment = value;
                    // 保存配置
                    const config = getGlobalConfig();
                    const debuggerItem = config.findDebuggerById(localDebuggerInformation.id);
                    if (debuggerItem) {
                        debuggerItem.comment = localDebuggerInformation.comment;
                        debuggerItem.updateTime = new Date().getTime();
                        config.persist();
                    }
                },
                5, // 行数
                undefined // 无最大长度限制
            )
        );

        // 初始化URL匹配方式下拉菜单
        const urlPatternOptions: SelectOption[] = [
            { value: 'equals-string', text: language.debugger_config.urlPatternType_EqualsThisString },
            { value: 'contains-string', text: language.debugger_config.urlPatternType_ContainsThisString },
            { value: 'match-regexp', text: language.debugger_config.urlPatternType_MatchThisRegexp },
            { value: 'match-all', text: language.debugger_config.urlPatternType_MatchALL }
        ];
        
        // 在DOM准备好后渲染SelectComponent
        setTimeout(() => {
            const selectContainer = $debuggerComponent.find(`#${debuggerInformation.id}-url-pattern-container`);
            if (selectContainer.length) {
                selectContainer.append(
                    this.selectComponent.render(
                        `${debuggerInformation.id}-url-pattern`,
                        urlPatternOptions,
                        debuggerInformation.urlPatternType || 'match-all',
                        undefined,
                        (value: string) => {
                            if (value === 'equals-string' || value === 'contains-string' || 
                                value === 'match-regexp' || value === 'match-all') {
                                localDebuggerInformation.urlPatternType = value as UrlPatternType;
                                // 保存配置
                                const config = getGlobalConfig();
                                const debuggerItem = config.findDebuggerById(localDebuggerInformation.id);
                                if (debuggerItem) {
                                    debuggerItem.urlPatternType = localDebuggerInformation.urlPatternType;
                                    debuggerItem.updateTime = new Date().getTime();
                                    config.persist();
                                }
                            }
                        }
                    )
                );
            }
        }, 0);

        // 添加按钮组件 - URL匹配测试
        $debuggerComponent.find(`#${debuggerInformation.id}-url-pattern-test-container`).append(
            this.buttonComponent.render(
                `${debuggerInformation.id}-url-pattern-test`,
                language.debugger_config.urlPatternTest,
                function() {
                    // 使用InputDialogComponent替代原生prompt
                    const inputDialog = InputDialogComponent.getInstance();
                    inputDialog.show(
                        language.debugger_config.urlPatternTest,
                        language.debugger_config.urlPatternTestPrompt,
                        (confirmed, testUrl) => {
                            if (confirmed && testUrl) {
                                const debuggerTester = new DebuggerTester();
                                const isMatch = debuggerTester.testUrl(localDebuggerInformation.urlPatternType, localDebuggerInformation.urlPattern, testUrl);
                                
                                // 使用AlertDialogComponent替代原生alert
                                const alertDialog = AlertDialogComponent.getInstance();
                                alertDialog.show(
                                    language.debugger_config.urlPatternTest,
                                    `${language.debugger_config.urlPatternTestResult} ${isMatch}`
                                );
                            }
                        },
                        '', // 默认值为空
                        'https://' // 提示输入URL的占位符
                    );
                },
                'primary', // 使用主按钮样式
                'small',   // 使用小尺寸按钮
                '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4M12 8h.01"></path></svg>' // 测试图标
            )
        );

        // 删除断点 - 使用自定义确认对话框
        $debuggerComponent.find(`#${debuggerInformation.id}-remove-btn`).on("click", function () {
            // 获取确认对话框实例
            const confirmDialog = ConfirmDialogComponent.getInstance();
            
            // 显示确认对话框
            confirmDialog.show(
                language.confirm_dialog.deleteBreakpoint,
                language.confirm_dialog.deleteConfirmMessage,
                (confirmed: boolean) => {
                    if (confirmed) {
                        // 用户确认删除
                        const config = getGlobalConfig();
                        config.removeDebuggerById(localDebuggerInformation.id);
                        config.persist();
                        
                        // 移除DOM元素
                        $debuggerComponent.remove();
                    }
                },
                language.confirm_dialog.okButton,
                language.confirm_dialog.cancelButton
            );
        });

        return $debuggerComponent;
    }

    private bindEvents() {
        const debuggerTester = new DebuggerTester();
        const globalConfig = getGlobalConfig();

        // Test URL match
        const testUrlButton = document.getElementById('test-url-button');
        testUrlButton?.addEventListener('click', () => {
            const urlPattern = (document.getElementById('url-pattern') as HTMLInputElement).value;
            const urlPatternType = (document.getElementById('url-pattern-type') as HTMLSelectElement).value as UrlPatternType;
            const testUrl = (document.getElementById('test-url') as HTMLInputElement).value;
            
            const isMatch = debuggerTester.testUrl(urlPatternType, urlPattern, testUrl);
            alert(isMatch ? 'URL matches!' : 'URL does not match.');
        });
    }
} 