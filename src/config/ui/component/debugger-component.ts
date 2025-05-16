import $ from 'jquery';
import { getGlobalConfig } from "../../config";
import { DebuggerTester } from "../../../debugger/debugger-tester";
import { ScriptContext } from "../../../context/script/script-context";

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
        autoJumpProjectSiteOnConfiguraionTips: string;
        autoJumpProjectSiteOnConfiguraion: string;
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
    /**
     * 构造初始的模板
     *
     * @param language 语言配置
     * @param debuggerConfig 断点配置
     * @return 模板字符串
     */
    private template(language: Language, debuggerConfig: DebuggerConfig): string {
        return `
<fieldset id="${debuggerConfig.id}" style="width: 800px !important; border: 1px solid #AAA !important; margin: 10px !important; padding: 10px !important;">      
    <legend style="color: #AAA !important;">${language.debugger_config.debuggerTitle}-${debuggerConfig.id}</legend>          
    <div id="${debuggerConfig.id}-remove-btn" style="float: right !important; cursor: pointer !important;">X</div>
    <table>
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
            <td align="left" style="padding: 10px;">
                <label class="js-script-hook-checkbox-container">
                    <input id="${debuggerConfig.id}-enable-checkbox" class="js-script-hook-input" type="checkbox" ${debuggerConfig.enable ? "checked='checked'" : ""}>
                    <span class="js-script-hook-custom-checkbox"></span>
                </label>
            </td>
        </tr>
        <tr>
            <td align="right" style="padding-left: 10px;">
                <div class="js-script-hook-tips-icon">
                    ?
                    <div class="js-script-hook-tooltip">
                        ${language.debugger_config.urlPatternTips}
                    </div>
                </div>
                <span>${language.debugger_config.urlPattern}</span>
            </td>
            <td align="left" style="padding: 10px;">
                <div style="border: 1px solid #CCC; padding: 10px; margin: 10px; width: 500px !important;"> 
                    <div style="display: inline-block;">
                        <div class="js-script-hook-tips-icon" >
                            ?
                            <div class="js-script-hook-tooltip">
                            ${language.debugger_config.urlPatternTypeTips}
                            </div>
                        </div>
                        <div class="js-script-hook-select-container" style="width: 400px !important; ">
                            <select id="${debuggerConfig.id}-url-pattern">
                                <option value="equals-string" >${language.debugger_config.urlPatternType_EqualsThisString}</option>
                                <option value="contains-string">${language.debugger_config.urlPatternType_ContainsThisString}</option>
                                <option value="match-regexp">${language.debugger_config.urlPatternType_MatchThisRegexp}</option>
                                <option value="match-all">${language.debugger_config.urlPatternType_MatchALL}</option>
                            </select>
                        </div>
                    </div>
                   <div>
                        <div class="js-script-hook-tips-icon" >
                            ?
                            <div class="js-script-hook-tooltip">
                            ${language.debugger_config.urlPatternTextTips}
                            </div>
                        </div>
                        <input class="js-script-hook-input" id="${debuggerConfig.id}-url-pattern-text" value="${debuggerConfig.urlPattern || ''}" type="text" placeholder="${language.debugger_config.urlPatternTextPlaceholder}" style="width: 400px !important;" />
                    </div>
                    <div>
                       <div class="js-script-hook-tips-icon">
                            ?
                            <div class="js-script-hook-tooltip">
                            ${language.debugger_config.urlPatternTestTips}
                            </div>
                        </div>
                        <button class="js-script-hook-button" id="${debuggerConfig.id}-url-pattern-test" style="cursor: pointer !important;">${language.debugger_config.urlPatternTest}</button>
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
            <td align="left" style="padding: 10px;">
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
            <td align="left" style="padding: 10px;">
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
            <td align="left" style="padding-left: 10px;">
                <input class="js-script-hook-input" type="text" id="${debuggerConfig.id}-callbackFunctionParamName-text" value="${debuggerConfig.callbackFunctionName || ''}" placeholder="${language.debugger_config.callbackFunctionParamNamePlaceholder}" />
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
            <td align="left" style="padding: 10px; ">
                <textarea class="js-script-hook-textarea" id="${debuggerConfig.id}-comment-text" placeholder="${language.debugger_config.commentPlaceholder}" style="width: 500px; height: 100px;">${debuggerConfig.comment || ""}</textarea>
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
        const $debuggerComponent = $(this.template(language, debuggerInformation));

        // 绑定事件
        const localDebuggerInformation = { ...debuggerInformation };

        // 启用/禁用断点
        $debuggerComponent.find(`#${debuggerInformation.id}-enable-checkbox`).on("change", function () {
            localDebuggerInformation.enable = $(this).prop("checked") as boolean;
        });

        // URL匹配方式
        $debuggerComponent.find(`#${debuggerInformation.id}-url-pattern`).on("change", function () {
            localDebuggerInformation.urlPatternType = $(this).val() as UrlPatternType;
        });

        // URL匹配文本
        $debuggerComponent.find(`#${debuggerInformation.id}-url-pattern-text`).on("change", function () {
            localDebuggerInformation.urlPattern = $(this).val() as string;
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
        });

        // 启用/禁用响应断点
        $debuggerComponent.find(`#${debuggerInformation.id}-enableResponseDebugger-checkbox`).on("change", function () {
            localDebuggerInformation.enableResponseDebugger = $(this).prop("checked") as boolean;
        });

        // Hook类型
        $debuggerComponent.find(`#${debuggerInformation.id}-hookType`).on("change", function () {
            localDebuggerInformation.hookType = $(this).val() as HookType;
        });

        // 回调函数参数名
        $debuggerComponent.find(`#${debuggerInformation.id}-callbackFunctionParamName-text`).on("change", function () {
            localDebuggerInformation.callbackFunctionName = $(this).val() as string;
        });

        // 备注
        $debuggerComponent.find(`#${debuggerInformation.id}-comment-text`).on("change", function () {
            localDebuggerInformation.comment = $(this).val() as string;
        });

        // 删除断点
        $debuggerComponent.find(`#${debuggerInformation.id}-remove-btn`).on("click", function () {
            $debuggerComponent.remove();
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