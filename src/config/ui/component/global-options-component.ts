/**
 * 全局配置参数组件 - 原生JavaScript实现
 */
import { getGlobalConfig } from "../../config";
import { Config } from "../../config";
// 导入语言相关的函数和接口
import { getLanguage, getLanguageByGlobalConfig, type Language } from "./language";
import { TipsComponent, CheckboxComponent, SelectComponent, SelectOption, InputComponent, TabComponent, TabItem } from './basic';
// 导入show函数用于重新加载配置界面
import { show } from "../../ui/menu";
import { loadValue } from "../../../storage";
import { ConfigurationComponent } from './configuration-component';

type HookType = "use-proxy-function" | "use-redeclare-function";

// 配置保存验证
function verifyConfigSaved() {
    try {
        // 验证配置是否确实被保存
        const savedConfig = loadValue("js-script-hook-config-name");
        if (savedConfig) {
            const currentConfig = getGlobalConfig();
            console.log('[配置验证] 当前内存中的配置:', currentConfig);
            console.log('[配置验证] 存储中的配置:', savedConfig);
            
            // 验证关键属性是否匹配
            if (savedConfig.language === currentConfig.language &&
                savedConfig.prefix === currentConfig.prefix &&
                savedConfig.hookType === currentConfig.hookType) {
                console.log('[配置验证] 验证成功: 关键配置属性匹配');
                return true;
            } else {
                console.error('[配置验证] 验证失败: 配置不匹配');
                return false;
            }
        }
        console.error('[配置验证] 验证失败: 无法读取保存的配置');
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
     * @returns HTMLElement
     */
    render(language: Language, oldConfig: Config): HTMLElement {
        // 确保样式已添加
        this.appendStyles();
        
        // 创建容器
        const container = document.createElement('fieldset');
        container.className = 'global-options-fieldset';
        
        // 创建标题
        const legend = document.createElement('legend');
        legend.className = 'global-options-legend';
        legend.textContent = language.global_settings.title;
        container.appendChild(legend);
        
        // 创建表格
        const table = document.createElement('table');
        table.className = 'global-options-table';
        container.appendChild(table);
        
        // 语言选项
        const languageRow = document.createElement('tr');
        const languageLabel = document.createElement('td');
        languageLabel.setAttribute('align', 'right');
        languageLabel.appendChild(this.tipsComponent.render(language.global_settings.languageTips));
        
        const languageSpan = document.createElement('span');
        languageSpan.textContent = language.global_settings.language;
        languageLabel.appendChild(languageSpan);
        languageRow.appendChild(languageLabel);
        
        const languageOptions: SelectOption[] = [
            { value: 'english', text: 'English' },
            { value: 'chinese', text: '简体中文' }
        ];
        
        const languageField = document.createElement('td');
        languageField.setAttribute('align', 'left');
        
        const languageSelect = this.selectComponent.render(
            'js-script-hook-global-config-language',
            languageOptions,
            oldConfig.language,
            undefined,
            (value: string) => {
                if (value === 'english' || value === 'chinese') {
                    oldConfig.language = value;
                    oldConfig.persist();
                    
                    // 验证配置是否成功保存
                    if (verifyConfigSaved()) {
                        // 重新加载配置界面以应用新语言
                        const configComponent = new ConfigurationComponent();
                        configComponent.show();
                    } else {
                        console.error('配置保存验证失败，不重新加载界面');
                    }
                }
            }
        );
        
        languageField.appendChild(languageSelect);
        languageRow.appendChild(languageField);
        table.appendChild(languageRow);
        
        // Hook类型选项
        const hookTypeRow = document.createElement('tr');
        const hookTypeLabel = document.createElement('td');
        hookTypeLabel.setAttribute('align', 'right');
        hookTypeLabel.appendChild(this.tipsComponent.render(language.global_settings.responseDebuggerHookTypeTips));
        
        const hookTypeSpan = document.createElement('span');
        hookTypeSpan.textContent = language.global_settings.responseDebuggerHookType;
        hookTypeLabel.appendChild(hookTypeSpan);
        hookTypeRow.appendChild(hookTypeLabel);
        
        const hookTypeOptions: SelectOption[] = [
            { value: 'use-proxy-function', text: language.global_settings.responseDebuggerHookTypeUseProxyFunction },
            { value: 'use-redeclare-function', text: language.global_settings.responseDebuggerHookTypeUseRedeclareFunction }
        ];
        
        const hookTypeField = document.createElement('td');
        hookTypeField.setAttribute('align', 'left');
        
        const hookTypeSelect = this.selectComponent.render(
            'js-script-hook-global-config-hook-type',
            hookTypeOptions,
            oldConfig.hookType,
            undefined,
            (value: string) => {
                if (value === 'use-proxy-function' || value === 'use-redeclare-function') {
                    oldConfig.hookType = value as HookType;
                    oldConfig.persist();
                }
            }
        );
        
        const hookTypeContainer = document.createElement('div');
        hookTypeContainer.style.display = 'inline-block';
        hookTypeContainer.style.width = '380px';
        hookTypeContainer.appendChild(hookTypeSelect);
        
        hookTypeField.appendChild(hookTypeContainer);
        hookTypeRow.appendChild(hookTypeField);
        table.appendChild(hookTypeRow);
        
        // 前缀选项
        const prefixRow = document.createElement('tr');
        const prefixLabel = document.createElement('td');
        prefixLabel.setAttribute('align', 'right');
        prefixLabel.appendChild(this.tipsComponent.render(language.global_settings.flagPrefixTips));
        
        const prefixSpan = document.createElement('span');
        prefixSpan.textContent = language.global_settings.flagPrefix;
        prefixLabel.appendChild(prefixSpan);
        prefixRow.appendChild(prefixLabel);
        
        const prefixField = document.createElement('td');
        prefixField.setAttribute('align', 'left');
        
        const prefixInput = this.inputComponent.render(
            'js-script-hook-global-config-prefix',
            oldConfig.prefix,
            language.global_settings.flagPrefixPlaceholder,
            undefined,
            (value: string) => {
                oldConfig.prefix = value;
                oldConfig.persist();
            }
        );
        
        const prefixContainer = document.createElement('div');
        prefixContainer.style.width = '380px';
        prefixContainer.appendChild(prefixInput);
        
        prefixField.appendChild(prefixContainer);
        prefixRow.appendChild(prefixField);
        table.appendChild(prefixRow);
        
        // 忽略.js后缀选项
        const ignoreSuffixRow = document.createElement('tr');
        const ignoreSuffixLabel = document.createElement('td');
        ignoreSuffixLabel.setAttribute('align', 'right');
        ignoreSuffixLabel.appendChild(this.tipsComponent.render(language.global_settings.isIgnoreJsSuffixRequestTips));
        
        const ignoreSuffixSpan = document.createElement('span');
        ignoreSuffixSpan.textContent = language.global_settings.isIgnoreJsSuffixRequest;
        ignoreSuffixLabel.appendChild(ignoreSuffixSpan);
        ignoreSuffixRow.appendChild(ignoreSuffixLabel);
        
        const ignoreSuffixField = document.createElement('td');
        ignoreSuffixField.setAttribute('align', 'left');
        
        const ignoreSuffixCheckbox = this.checkboxComponent.render(
            'js-script-hook-global-config-ignore-js-suffix',
            oldConfig.isIgnoreJsSuffixRequest,
            (isChecked: boolean) => {
                oldConfig.isIgnoreJsSuffixRequest = isChecked;
                oldConfig.persist();
            }
        );
        
        ignoreSuffixField.appendChild(ignoreSuffixCheckbox);
        ignoreSuffixRow.appendChild(ignoreSuffixField);
        table.appendChild(ignoreSuffixRow);
        
        // 忽略非JSONP选项
        const ignoreNotJsonpRow = document.createElement('tr');
        const ignoreNotJsonpLabel = document.createElement('td');
        ignoreNotJsonpLabel.setAttribute('align', 'right');
        ignoreNotJsonpLabel.appendChild(this.tipsComponent.render(language.global_settings.isIgnoreNotJsonpRequestTips));
        
        const ignoreNotJsonpSpan = document.createElement('span');
        ignoreNotJsonpSpan.textContent = language.global_settings.isIgnoreNotJsonpRequest;
        ignoreNotJsonpLabel.appendChild(ignoreNotJsonpSpan);
        ignoreNotJsonpRow.appendChild(ignoreNotJsonpLabel);
        
        const ignoreNotJsonpField = document.createElement('td');
        ignoreNotJsonpField.setAttribute('align', 'left');
        
        const ignoreNotJsonpCheckbox = this.checkboxComponent.render(
            'js-script-hook-global-config-ignore-not-jsonp',
            oldConfig.isIgnoreNotJsonpRequest,
            (isChecked: boolean) => {
                oldConfig.isIgnoreNotJsonpRequest = isChecked;
                oldConfig.persist();
            }
        );
        
        ignoreNotJsonpField.appendChild(ignoreNotJsonpCheckbox);
        ignoreNotJsonpRow.appendChild(ignoreNotJsonpField);
        table.appendChild(ignoreNotJsonpRow);
        
        return container;
    }
} 