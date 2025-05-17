import $ from 'jquery';
import { getGlobalConfig } from "../../config";
import { DebuggerTester } from "../../../debugger/debugger-tester";
import { ScriptContext } from "../../../context/script/script-context";
import { SelectComponent, SelectOption, ConfirmDialogComponent } from './basic';

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
    private readonly styleCSS: string;
    
    constructor() {
        this.selectComponent = new SelectComponent();
        
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
            width: 26px;
            height: 26px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            background-color: transparent;
            border-radius: 50%;
            font-size: 16px;
            color: #999;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .debugger-component-remove-btn:hover {
            color: #f44336;
            background-color: rgba(244, 67, 54, 0.1);
            transform: rotate(90deg);
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
    <button id="${debuggerConfig.id}-remove-btn" class="debugger-component-remove-btn" title="删除断点">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
            <td align="left">
                <label class="js-script-hook-checkbox-container">
                    <input id="${debuggerConfig.id}-enable-checkbox" class="js-script-hook-input" type="checkbox" ${debuggerConfig.enable ? "checked='checked'" : ""}>
                    <span class="js-script-hook-custom-checkbox"></span>
                </label>
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
                        <input class="js-script-hook-input" id="${debuggerConfig.id}-url-pattern-text" value="${debuggerConfig.urlPattern || ''}" type="text" placeholder="${language.debugger_config.urlPatternTextPlaceholder}" style="width: 380px;" />
                    </div>
                    <div>
                       <div class="js-script-hook-tips-icon">
                            ?
                            <div class="js-script-hook-tooltip">
                            ${language.debugger_config.urlPatternTestTips}
                            </div>
                        </div>
                        <button class="js-script-hook-button" id="${debuggerConfig.id}-url-pattern-test" style="cursor: pointer;">${language.debugger_config.urlPatternTest}</button>
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
            <td align="left">
                <label class="js-script-hook-checkbox-container">
                    <input id="${debuggerConfig.id}-enableRequestDebugger-checkbox" class="js-script-hook-input" type="checkbox" ${debuggerConfig.enableRequestDebugger ? "checked='checked'" : ""}>
                    <span class="js-script-hook-custom-checkbox"></span>
                </label>
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
            <td align="left">
                <label class="js-script-hook-checkbox-container">
                    <input id="${debuggerConfig.id}-enableResponseDebugger-checkbox" class="js-script-hook-input" type="checkbox" ${debuggerConfig.enableResponseDebugger ? "checked='checked'" : ""}>
                    <span class="js-script-hook-custom-checkbox"></span>
                </label>
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
            <td align="left">
                <input class="js-script-hook-input" type="text" id="${debuggerConfig.id}-callbackFunctionParamName-text" value="${debuggerConfig.callbackFunctionName || ''}" placeholder="${language.debugger_config.callbackFunctionParamNamePlaceholder}" style="width: 380px;" />
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
            <td align="left">
                <textarea class="js-script-hook-textarea" id="${debuggerConfig.id}-comment-text" placeholder="${language.debugger_config.commentPlaceholder}" style="width: 480px; height: 100px;">${debuggerConfig.comment || ""}</textarea>
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
                        debuggerInformation.urlPatternType || 'match-all'
                    )
                );
            }
        }, 0);

        // 启用/禁用断点
        $debuggerComponent.find(`#${debuggerInformation.id}-enable-checkbox`).on("change", function () {
            localDebuggerInformation.enable = $(this).prop("checked") as boolean;
            // 保存配置
            const config = getGlobalConfig();
            const debuggerItem = config.findDebuggerById(localDebuggerInformation.id);
            if (debuggerItem) {
                debuggerItem.enable = localDebuggerInformation.enable;
                debuggerItem.updateTime = new Date().getTime();
                config.persist();
            }
        });

        // URL匹配方式 - 使用SelectComponent的事件
        $debuggerComponent.on("change", `#${debuggerInformation.id}-url-pattern`, function () {
            const value = $(this).val() as string;
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
        });

        // URL匹配文本
        $debuggerComponent.find(`#${debuggerInformation.id}-url-pattern-text`).on("change", function () {
            localDebuggerInformation.urlPattern = $(this).val() as string;
            // 保存配置
            const config = getGlobalConfig();
            const debuggerItem = config.findDebuggerById(localDebuggerInformation.id);
            if (debuggerItem) {
                debuggerItem.urlPattern = localDebuggerInformation.urlPattern;
                debuggerItem.updateTime = new Date().getTime();
                config.persist();
            }
        });

        // URL匹配测试
        $debuggerComponent.find(`#${debuggerInformation.id}-url-pattern-test`).on("click", function () {
            const testUrl = prompt(language.debugger_config.urlPatternTestPrompt);
            if (!testUrl) {
                return;
            }
            const debuggerTester = new DebuggerTester();
            const isMatch = debuggerTester.testUrl(localDebuggerInformation.urlPatternType, localDebuggerInformation.urlPattern, testUrl);
            alert(`${language.debugger_config.urlPatternTestResult} ${isMatch}`);
        });

        // 启用/禁用请求断点
        $debuggerComponent.find(`#${debuggerInformation.id}-enableRequestDebugger-checkbox`).on("change", function () {
            localDebuggerInformation.enableRequestDebugger = $(this).prop("checked") as boolean;
            // 保存配置
            const config = getGlobalConfig();
            const debuggerItem = config.findDebuggerById(localDebuggerInformation.id);
            if (debuggerItem) {
                debuggerItem.enableRequestDebugger = localDebuggerInformation.enableRequestDebugger;
                debuggerItem.updateTime = new Date().getTime();
                config.persist();
            }
        });

        // 启用/禁用响应断点
        $debuggerComponent.find(`#${debuggerInformation.id}-enableResponseDebugger-checkbox`).on("change", function () {
            localDebuggerInformation.enableResponseDebugger = $(this).prop("checked") as boolean;
            // 保存配置
            const config = getGlobalConfig();
            const debuggerItem = config.findDebuggerById(localDebuggerInformation.id);
            if (debuggerItem) {
                debuggerItem.enableResponseDebugger = localDebuggerInformation.enableResponseDebugger;
                debuggerItem.updateTime = new Date().getTime();
                config.persist();
            }
        });

        // Hook类型
        $debuggerComponent.find(`#${debuggerInformation.id}-hookType`).on("change", function () {
            localDebuggerInformation.hookType = $(this).val() as HookType;
            // 保存配置
            const config = getGlobalConfig();
            const debuggerItem = config.findDebuggerById(localDebuggerInformation.id);
            if (debuggerItem) {
                (debuggerItem as any).hookType = localDebuggerInformation.hookType;
                debuggerItem.updateTime = new Date().getTime();
                config.persist();
            }
        });

        // 回调函数参数名
        $debuggerComponent.find(`#${debuggerInformation.id}-callbackFunctionParamName-text`).on("change", function () {
            localDebuggerInformation.callbackFunctionName = $(this).val() as string;
            // 保存配置
            const config = getGlobalConfig();
            const debuggerItem = config.findDebuggerById(localDebuggerInformation.id);
            if (debuggerItem) {
                debuggerItem.callbackFunctionName = localDebuggerInformation.callbackFunctionName;
                debuggerItem.updateTime = new Date().getTime();
                config.persist();
            }
        });

        // 备注
        $debuggerComponent.find(`#${debuggerInformation.id}-comment-text`).on("change", function () {
            localDebuggerInformation.comment = $(this).val() as string;
            // 保存配置
            const config = getGlobalConfig();
            const debuggerItem = config.findDebuggerById(localDebuggerInformation.id);
            if (debuggerItem) {
                debuggerItem.comment = localDebuggerInformation.comment;
                debuggerItem.updateTime = new Date().getTime();
                config.persist();
            }
        });

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