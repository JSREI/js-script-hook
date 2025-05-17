import $ from 'jquery';
import { getGlobalConfig } from "../../config";
import { Config } from "../../config";
// 导入语言相关的函数和接口
import { getLanguage, getLanguageByGlobalConfig, type Language } from "./language";
import { TipsComponent, CheckboxComponent, SelectComponent, SelectOption, InputComponent, TabComponent, TabItem } from './basic';
// 导入show函数用于重新加载配置界面
import { show } from "../../ui/menu";
import { loadValue } from "../../../utils/storage-util";
import { ConfigurationComponent } from './configuration-component';

type HookType = "use-proxy-function" | "use-redeclare-function";

// 配置保存验证
function verifyConfigSaved() {
    try {
        // 验证配置是否确实被保存
        const savedConfig = loadValue("js-script-hook-config-name");
        if (savedConfig) {
            const parsedConfig = JSON.parse(savedConfig);
            console.log('[配置验证] 当前内存中的配置:', getGlobalConfig());
            console.log('[配置验证] 存储中的配置:', parsedConfig);
            return true;
        }
        return false;
    } catch (e) {
        console.error('[配置验证] 错误:', e);
        return false;
    }
}

/**
 * 全局配置参数组件
 */
export class GlobalOptionsComponent {
    private readonly styleCSS: string;
    private tipsComponent: TipsComponent;
    private checkboxComponent: CheckboxComponent;
    private selectComponent: SelectComponent;
    private inputComponent: InputComponent;
    
    constructor() {
        // 初始化基础组件
        this.tipsComponent = new TipsComponent();
        this.checkboxComponent = new CheckboxComponent();
        this.selectComponent = new SelectComponent();
        this.inputComponent = new InputComponent();
        
        this.styleCSS = `
        /* 问号提示图标样式 */
        .js-script-hook-tips-icon {
            display: inline-block;
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            border-radius: 50%;
            background-color: #eee;
            color: #666;
            cursor: help;
            margin-right: 5px;
            position: relative;
            font-weight: bold;
        }
        
        .js-script-hook-tips-icon:hover {
            background-color: #ddd;
        }
        
        /* 问号提示内容 */
        .js-script-hook-tooltip {
            display: none;
            position: absolute;
            z-index: 100;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            width: 300px;
            top: -5px;
            left: 25px;
            font-weight: normal;
            text-align: left;
            font-size: 12px;
        }
        
        .js-script-hook-tips-icon:hover .js-script-hook-tooltip {
            display: block;
        }
        
        /* 表单样式 */
        .global-options-fieldset {
            border: 1px solid #AAA;
            margin: 15px 0;
            padding: 15px;
            width: 780px;
            border-radius: 6px;
            background-color: #fcfcfc;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            transition: box-shadow 0.2s ease;
        }
        
        .global-options-fieldset:hover {
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .global-options-legend {
            color: #666;
            font-weight: 500;
            padding: 0 10px;
            font-size: 14px;
        }
        
        .global-options-table {
            width: 100%;
            border-spacing: 0;
        }
        
        .global-options-table td {
            padding: 8px;
            vertical-align: middle;
        }
        
        .global-options-table td[align="right"] {
            width: 200px;
            text-align: right;
            padding-right: 15px;
        }
        
        .global-options-table td[align="left"] {
            text-align: left;
            padding-left: 15px;
        }
        `;
    }

    /**
     * 添加组件样式到页面
     */
    private appendStyles(): void {
        // 避免重复插入
        if (document.getElementById("global-options-component-style")) {
            return;
        }
        
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "global-options-component-style";
        style.appendChild(document.createTextNode(this.styleCSS));
        document.head.appendChild(style);
    }
    
    /**
     * 渲染全局选项组件
     * 
     * @param language 语言配置
     * @param oldConfig 旧的配置
     * @returns jQuery对象
     */
    render(language: Language, oldConfig: Config): JQuery<HTMLElement> {
        // 确保样式已添加
        this.appendStyles();
        
        const container = $('<fieldset class="global-options-fieldset"></fieldset>');
        container.append($(`<legend class="global-options-legend">${language.global_settings.title}</legend>`));
        
        const table = $('<table class="global-options-table"></table>');
        container.append(table);
        
        // 语言选项
        const languageRow = $('<tr></tr>');
        const languageLabel = $('<td align="right"></td>');
        languageLabel.append(this.tipsComponent.render(language.global_settings.languageTips));
        languageLabel.append($(`<span>${language.global_settings.language}</span>`));
        languageRow.append(languageLabel);
        
        const languageOptions: SelectOption[] = [
            { value: 'english', text: 'English' },
            { value: 'chinese', text: '简体中文' }
        ];
        
        const languageField = $('<td align="left"></td>');
        languageField.append(this.selectComponent.render(
            'js-script-hook-global-config-language',
            languageOptions,
            oldConfig.language
        ));
        languageRow.append(languageField);
        table.append(languageRow);
        
        // Hook类型选项
        const hookTypeRow = $('<tr></tr>');
        const hookTypeLabel = $('<td align="right"></td>');
        hookTypeLabel.append(this.tipsComponent.render(language.global_settings.responseDebuggerHookTypeTips));
        hookTypeLabel.append($(`<span>${language.global_settings.responseDebuggerHookType}</span>`));
        hookTypeRow.append(hookTypeLabel);
        
        const hookTypeOptions: SelectOption[] = [
            { value: 'use-proxy-function', text: language.global_settings.responseDebuggerHookTypeUseProxyFunction },
            { value: 'use-redeclare-function', text: language.global_settings.responseDebuggerHookTypeUseRedeclareFunction }
        ];
        
        const hookTypeField = $('<td align="left"></td>');
        hookTypeField.append($('<div style="display: inline-block; width: 380px;"></div>').append(
            this.selectComponent.render(
                'js-script-hook-global-config-hook-type',
                hookTypeOptions,
                (oldConfig.hookType as string) || 'use-proxy-function'
            )
        ));
        hookTypeRow.append(hookTypeField);
        table.append(hookTypeRow);
        
        // 标志前缀选项
        const prefixRow = $('<tr></tr>');
        const prefixLabel = $('<td align="right"></td>');
        prefixLabel.append(this.tipsComponent.render(language.global_settings.flagPrefixTips));
        prefixLabel.append($(`<span>${language.global_settings.flagPrefix}</span>`));
        prefixRow.append(prefixLabel);
        
        const prefixField = $('<td align="left"></td>');
        prefixField.append($('<div style="width: 380px;"></div>').append(
            this.inputComponent.render(
                'js-script-hook-global-config-flag-prefix',
                oldConfig.prefix || '',
                language.global_settings.flagPrefixPlaceholder
            )
        ));
        prefixRow.append(prefixField);
        table.append(prefixRow);
        
        // 忽略JS后缀请求选项
        const ignoreJsRow = $('<tr></tr>');
        const ignoreJsLabel = $('<td align="right"></td>');
        ignoreJsLabel.append(this.tipsComponent.render(language.global_settings.isIgnoreJsSuffixRequestTips));
        ignoreJsLabel.append($(`<span>${language.global_settings.isIgnoreJsSuffixRequest}</span>`));
        ignoreJsRow.append(ignoreJsLabel);
        
        const ignoreJsField = $('<td align="left"></td>');
        ignoreJsField.append(
            this.checkboxComponent.render(
                'js-script-hook-global-config-isIgnoreJsSuffixRequest',
                oldConfig.isIgnoreJsSuffixRequest
            )
        );
        ignoreJsRow.append(ignoreJsField);
        table.append(ignoreJsRow);
        
        // 忽略非JSONP请求选项
        const ignoreNotJsonpRow = $('<tr></tr>');
        const ignoreNotJsonpLabel = $('<td align="right"></td>');
        ignoreNotJsonpLabel.append(this.tipsComponent.render(language.global_settings.isIgnoreNotJsonpRequestTips));
        ignoreNotJsonpLabel.append($(`<span>${language.global_settings.isIgnoreNotJsonpRequest}</span>`));
        ignoreNotJsonpRow.append(ignoreNotJsonpLabel);
        
        const ignoreNotJsonpField = $('<td align="left"></td>');
        ignoreNotJsonpField.append(
            this.checkboxComponent.render(
                'js-script-hook-global-config-isIgnoreNotJsonpRequest',
                oldConfig.isIgnoreNotJsonpRequest
            )
        );
        ignoreNotJsonpRow.append(ignoreNotJsonpField);
        table.append(ignoreNotJsonpRow);
        
        // 添加事件处理器
        container.on('change', '#js-script-hook-global-config-language', function() {
            const config = getGlobalConfig();
            // 使用显式类型转换确保与Config中定义的language类型兼容
            const langValue = ($(this).val() as string);
            console.log('[语言切换] 用户选择了语言:', langValue);
            
            if (langValue === 'english' || langValue === 'chinese') {
                console.log('[语言切换] 更改前语言:', config.language);
                config.language = langValue;
                console.log('[语言切换] 已更新内存中的语言设置:', config.language);
                
                try {
                    console.log('[语言切换] 正在保存配置...');
                    config.persist(); // 保存配置
                    console.log('[语言切换] 配置已保存');
                    
                    // 测试保存是否成功
                    const savedConfig = verifyConfigSaved();
                    if (savedConfig) {
                        console.log('[语言切换] 验证保存的语言设置:', config.language);
                        console.log('[语言切换] 保存是否成功:', savedConfig);
                        
                        // 更新当前窗口内容，而不是关闭并重新打开
                        console.log('[语言切换] 正在更新界面应用新语言');
                        const modalWindow = $("#jsrei-js-script-hook-configuration-modal-window");
                        if (modalWindow.length) {
                            // 仅更新内容区域，不关闭整个窗口
                            const contentDiv = $("#js-script-hook-configuration-content");
                            if (contentDiv.length) {
                                // 保存当前激活的选项卡
                                const activeTabId = $(".js-script-hook-tab-header.active").attr("data-tab-id");
                                console.log('[语言切换] 当前激活的选项卡:', activeTabId);
                                
                                // 清空内容
                                contentDiv.empty();
                                
                                // 创建新的配置组件并获取更新的内容
                                const configComponent = new ConfigurationComponent();
                                
                                // 更新关闭按钮文本
                                const newLanguage = getLanguage(config.language);
                                $("#jsrei-js-script-hook-configuration-close-btn").attr("title", newLanguage.confirm_dialog.closeWindow);
                                
                                // 获取和渲染新的选项卡组件
                                const tabItems: TabItem[] = [
                                    {
                                        id: 'debugger-list-tab',
                                        title: newLanguage.tabs.debuggerListTab,
                                        content: configComponent.createDebuggerListTab(newLanguage),
                                        active: activeTabId === 'debugger-list-tab',
                                        icon: configComponent.getDebuggerListIcon()
                                    },
                                    {
                                        id: 'global-settings-tab',
                                        title: newLanguage.tabs.globalSettingsTab,
                                        content: configComponent.createGlobalSettingsTab(newLanguage),
                                        active: activeTabId === 'global-settings-tab',
                                        icon: configComponent.getGlobalSettingsIcon()
                                    },
                                    {
                                        id: 'about-tab',
                                        title: newLanguage.tabs.aboutTab,
                                        content: configComponent.createAboutTab(newLanguage),
                                        active: activeTabId === 'about-tab',
                                        icon: configComponent.getAboutIcon()
                                    }
                                ];
                                
                                // 如果没有找到活动选项卡，默认激活第一个
                                if (!activeTabId || !tabItems.some(item => item.active)) {
                                    tabItems[0].active = true;
                                }
                                
                                // 渲染新的选项卡
                                const tabComponent = new TabComponent();
                                contentDiv.append(tabComponent.render(tabItems));
                                
                                // 轻微闪动效果，提示用户语言已更改
                                modalWindow.find('.js-script-hook-scrollable-div').css('box-shadow', '0 0 15px rgba(40,167,69,0.8)');
                                setTimeout(() => {
                                    modalWindow.find('.js-script-hook-scrollable-div').css('box-shadow', '0 6px 16px rgba(0,0,0,0.2)');
                                }, 300);
                            }
                        }
                    } else {
                        console.error('[语言切换] 无法读取保存的配置!');
                    }
                } catch (error) {
                    console.error('[语言切换] 保存配置时出错:', error);
                }
            }
        });
        
        container.on('change', '#js-script-hook-global-config-hook-type', function() {
            const config = getGlobalConfig();
            const hookType = $(this).val() as HookType;
            console.log('[Hook类型更改] 用户选择:', hookType);
            
            config.hookType = hookType;
            config.persist(); // 保存配置
            
            // 验证保存
            const saved = verifyConfigSaved();
            console.log('[Hook类型更改] 保存成功?', saved);
        });
        
        container.on('input', '#js-script-hook-global-config-flag-prefix', function() {
            const config = getGlobalConfig();
            const prefix = $(this).val() as string;
            console.log('[前缀更改] 用户输入:', prefix);
            
            config.prefix = prefix;
            config.persist(); // 保存配置
            
            // 验证保存
            const saved = verifyConfigSaved();
            console.log('[前缀更改] 保存成功?', saved);
        });
        
        container.on('change', '#js-script-hook-global-config-isIgnoreJsSuffixRequest', function() {
            const config = getGlobalConfig();
            const isChecked = $(this).is(':checked');
            console.log('[忽略JS后缀更改] 用户选择:', isChecked);
            
            config.isIgnoreJsSuffixRequest = isChecked;
            config.persist(); // 保存配置
            
            // 验证保存
            const saved = verifyConfigSaved();
            console.log('[忽略JS后缀更改] 保存成功?', saved);
        });
        
        container.on('change', '#js-script-hook-global-config-isIgnoreNotJsonpRequest', function() {
            const config = getGlobalConfig();
            const isChecked = $(this).is(':checked');
            console.log('[忽略非JSONP更改] 用户选择:', isChecked);
            
            config.isIgnoreNotJsonpRequest = isChecked;
            config.persist(); // 保存配置
            
            // 验证保存
            const saved = verifyConfigSaved();
            console.log('[忽略非JSONP更改] 保存成功?', saved);
        });
        
        return container;
    }
} 