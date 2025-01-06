const {getGlobalConfig} = require("../../config");
const {DebuggerTester} = require("../../../debugger/debugger-tester");

/**
 * 用于表示一个断点配置
 */
class DebuggerComponent {

    /**
     * 构造初始的模板
     *
     * @param language
     * @param debuggerConfig
     * @return {string}
     */
    template(language, debuggerConfig) {
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
                <input class="js-script-hook-input" type="text" id="${debuggerConfig.id}-callbackFunctionParamName-text" value="${debuggerConfig.callbackFunctionParamName || ''}" placeholder="${language.debugger_config.callbackFunctionParamNamePlaceholder}" />
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
     * @param language
     * @param debuggerInformation
     * @return {*|jQuery|HTMLElement}
     */
    render(language, debuggerInformation) {
        const debuggerElt = $(this.template(language, debuggerInformation));

        // 设置匹配类型
        if (debuggerInformation.urlPatternType) {
            debuggerElt.find(`#${debuggerInformation.id}-url-pattern`).val(debuggerInformation.urlPatternType);
        }

        // 断点是否开启
        debuggerElt.find(`#${debuggerInformation.id}-enable-checkbox`).on('change', function () {
            const localDebuggerInformation = getGlobalConfig().findDebuggerById(debuggerInformation.id);
            localDebuggerInformation.enable = $(this).is(':checked');
            getGlobalConfig().persist();
        });

        // URL匹配类型
        debuggerElt.find(`#${debuggerInformation.id}-url-pattern`).change(function () {
            const localDebuggerInformation = getGlobalConfig().findDebuggerById(debuggerInformation.id);
            localDebuggerInformation.urlPatternType = $(this).val();
            getGlobalConfig().persist();
        });

        // URL匹配值
        debuggerElt.find(`#${debuggerInformation.id}-url-pattern-text`).on('input', function () {
            const localDebuggerInformation = getGlobalConfig().findDebuggerById(debuggerInformation.id);
            localDebuggerInformation.urlPattern = this.value;
            getGlobalConfig().persist();
        });

        // URL匹配测试
        debuggerElt.find(`#${debuggerInformation.id}-url-pattern-test`).on('click', function () {
            let urlForTest = prompt(language.debugger_config.urlPatternTestPrompt, "");
            const debuggerConfig = getGlobalConfig().findDebuggerById(debuggerInformation.id);
            const result = new DebuggerTester().testUrlPattern(debuggerConfig.urlPatternType, debuggerConfig.urlPattern, urlForTest);
            alert(language.debugger_config.urlPatternTestResult + result);
        });

        // enableRequestDebugger
        debuggerElt.find(`#${debuggerInformation.id}-enableRequestDebugger-checkbox`).on('change', function () {
            const localDebuggerInformation = getGlobalConfig().findDebuggerById(debuggerInformation.id);
            localDebuggerInformation.enableRequestDebugger = $(this).is(':checked');
            getGlobalConfig().persist();
        });

        // enableResponseDebugger
        debuggerElt.find(`#${debuggerInformation.id}-enableResponseDebugger-checkbox`).on('change', function () {
            const localDebuggerInformation = getGlobalConfig().findDebuggerById(debuggerInformation.id);
            localDebuggerInformation.enableResponseDebugger = $(this).is(':checked');
            getGlobalConfig().persist();
        });

        // callbackFunctionParamName
        debuggerElt.find(`#${debuggerInformation.id}-callbackFunctionParamName-text`).on('input', function () {
            const localDebuggerInformation = getGlobalConfig().findDebuggerById(debuggerInformation.id);
            localDebuggerInformation.callbackFunctionParamName = this.value;
            getGlobalConfig().persist();
        });

        // 注释
        debuggerElt.find(`#${debuggerInformation.id}-comment-text`).on('input', function () {
            const localDebuggerInformation = getGlobalConfig().findDebuggerById(debuggerInformation.id);
            localDebuggerInformation.comment = this.value;
            getGlobalConfig().persist();
        });

        // 删除按钮
        debuggerElt.find(`#${debuggerInformation.id}-remove-btn`).click(function () {
            $(`#${debuggerInformation.id}`).remove();

            getGlobalConfig().removeDebuggerById(debuggerInformation.id);
            getGlobalConfig().persist();
        });

        return debuggerElt;
    }


    // // 鼠标划过与移走
    // manifestElt.onmouseover = function () {
    //
    //     // 获取元素的边界矩形
    //     const rect = manifestElt.getBoundingClientRect();
    //
    //     // 获取页面的滚动偏移量
    //     const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    //     const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    //
    //     // 计算绝对位置
    //     const absoluteTop = rect.top + scrollTop;
    //     const absoluteLeft = rect.left + scrollLeft;
    //
    //     tips.style.display = 'block';
    //     tips.style.position = 'absolute';
    //     tips.style.left = `${absoluteLeft}px`;
    //     tips.style.top = `${absoluteTop - tips.offsetHeight - 20}px`;
    // };
    // manifestElt.onmouseout = function () {
    //     tips.style.display = 'none';
    // };

}

module.exports = {
    DebuggerComponent
}
