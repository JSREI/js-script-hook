const {getGlobalConfig} = require("../../config");
const {renderSwitchComponent} = require("./switch-component");

/**
 * 全局配置参数
 */
class GlobalOptionsComponent {


    /**
     * 渲染模板
     *
     * @param oldConfig
     * @param language
     * @return {string}
     */
    template(oldConfig, language) {
        return `
<fieldset style="border: 1px solid #AAA !important; margin: 10px !important; padding: 10px !important; width: 800px !important; ">
    <legend style="color: #AAA !important;">${language.global_settings.title}</legend>
    <table>
        <tr>
            <td align="right">
                <!-- 问号形式的 Tips 组件 -->
                <div class="js-script-hook-tips-icon">
                    ?
                    <div class="js-script-hook-tooltip">
                        ${language.global_settings.languageTips}
                    </div>
                </div>
                <span>${language.global_settings.language}</span>
            </td>
            <td align="left" style="padding: 10px;">
                <div class="js-script-hook-select-container">
                    <select id="js-script-hook-global-config-language">
                        <option value="english" ${oldConfig.language === 'english' ? 'selected' : ''}>English</option>
                        <option value="chinese" ${oldConfig.language === 'chinese' ? 'selected' : ''}>简体中文</option>
                    </select>
                </div>
            </td>
        </tr>
        <tr>
            <td align="right">
                <!-- 问号形式的 Tips 组件 -->
                <div class="js-script-hook-tips-icon">
                    ?
                    <div class="js-script-hook-tooltip">
                        ${language.global_settings.flagPrefixTips}
                    </div>
                </div>
                <span>${language.global_settings.flagPrefix}</span> 
            </td>
            <td align="left" style="padding: 10px;">
                <div style="width: 450px">
                    <input class="js-script-hook-input" type="text" value="${oldConfig.prefix || ''}" placeholder="${language.global_settings.flagPrefixPlaceholder}" id="js-script-hook-global-config-flag-prefix"/>
                </div>
            </td>
        </tr>
        <tr>
            <td align="right">
                <div class="js-script-hook-tips-icon">
                    ?
                    <div class="js-script-hook-tooltip">
                        ${language.global_settings.isIgnoreJsSuffixRequestTips}
                    </div>
                </div>
                <span>${language.global_settings.isIgnoreJsSuffixRequest}</span>
            </td>
            <td align="left" style="padding: 10px;">
                <label class="js-script-hook-checkbox-container">
                    <input id="js-script-hook-global-config-isIgnoreJsSuffixRequest" class="js-script-hook-input" type="checkbox" ${oldConfig.isIgnoreJsSuffixRequest ? "checked='checked'" : ""}>
                    <span class="js-script-hook-custom-checkbox"></span>
                </label>
            </td>
        </tr>
        <tr>
            <td align="right">
                <div class="js-script-hook-tips-icon">
                    ?
                    <div class="js-script-hook-tooltip">
                        ${language.global_settings.isIgnoreNotJsonpRequestTips}
                    </div>
                </div>
                <span>${language.global_settings.isIgnoreNotJsonpRequest}</span>
            </td>
            <td align="left" style="padding: 10px;">
                <label class="js-script-hook-checkbox-container">
                    <input id="js-script-hook-global-config-isIgnoreNotJsonpRequest" class="js-script-hook-input" type="checkbox" ${oldConfig.isIgnoreNotJsonpRequest ? "checked='checked'" : ""}>
                    <span class="js-script-hook-custom-checkbox"></span>
                </label>
            </td>
        </tr>
        <tr>
            <td align="right">
                <div class="js-script-hook-tips-icon">
                    ?
                    <div class="js-script-hook-tooltip">
                        ${language.global_settings.autoJumpProjectSiteOnConfiguraionTips}
                    </div>
                </div>
                <span>${language.global_settings.autoJumpProjectSiteOnConfiguraion}</span>
            </td>
            <td align="left" style="padding: 10px;">
                <label class="js-script-hook-checkbox-container">
                    <input id="js-script-hook-global-config-autoJumpProjectSiteOnConfiguraion" class="js-script-hook-input" type="checkbox" ${oldConfig.autoJumpProjectSiteOnConfiguraion ? "checked='checked'" : ""}>
                    <span class="js-script-hook-custom-checkbox"></span>
                </label>
            </td>
        </tr>
    </table>
</fieldset>
        `;
    }

    /**
     *
     * 渲染全局配置
     *
     * @param language
     * @param oldConfig {Config}
     */
    render(language, oldConfig) {
        const component = $(this.template(oldConfig, language));

        // 切换语言选择
        component.find("#js-script-hook-global-config-language").change(function () {
            getGlobalConfig().language = $(this).val();
            getGlobalConfig().persist();
        });

        // 全局标志的前缀
        component.find("#js-script-hook-global-config-flag-prefix").on("input", function () {
            getGlobalConfig().prefix = this.value;
            getGlobalConfig().persist();
        });

        // 是否忽略所有的js文件的请求
        component.find("#js-script-hook-global-config-isIgnoreJsSuffixRequest").on("change", function () {
            getGlobalConfig().isIgnoreJsSuffixRequest = $(this).is(':checked');
            getGlobalConfig().persist();
        });

        // 是否忽略所有的非jsonp的请求
        component.find("#js-script-hook-global-config-isIgnoreNotJsonpRequest").on("change", function () {
            getGlobalConfig().isIgnoreNotJsonpRequest = $(this).is(':checked');
            getGlobalConfig().persist();
        });

        // 在打开配置页面的时候自动跳转项目主页
        component.find("#js-script-hook-global-config-autoJumpProjectSiteOnConfiguraion").on("change", function () {
            debugger;
            getGlobalConfig().autoJumpProjectSiteOnConfiguraion = $(this).is(':checked');
            getGlobalConfig().persist();
        });

        return component;
    }

}

module.exports = {
    GlobalOptionsComponent
}
