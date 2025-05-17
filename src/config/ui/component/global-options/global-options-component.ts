/**
 * 全局配置参数组件 - 原生JavaScript实现
 */
import { getGlobalConfig } from "../../../config";
import { Config } from "../../../config";
import { getLanguage, type Language } from "../language";
import { 
    TipsComponent, 
    CheckboxComponent, 
    SelectComponent, 
    SelectOption, 
    InputComponent
} from '../basic';
import { LanguageUpdateable, LanguageEventManager } from '../language-event';
import { createLogger } from '../../../../logger';
import { globalOptionsStyles } from './styles';
import { createGlobalOptionsContainer } from './template';
import { 
    handleLanguageSelect, 
    handleHookTypeSelect, 
    handlePrefixInput, 
    handleIgnoreJsSuffixCheckbox, 
    handleIgnoreNotJsonpCheckbox 
} from './events';

const globalOptionsLogger = createLogger('global-options-component');

/**
 * 全局配置参数组件
 */
export class GlobalOptionsComponent implements LanguageUpdateable {
    private readonly componentId: string;
    private tipsComponent: TipsComponent;
    private checkboxComponent: CheckboxComponent;
    private languageSelectComponent: SelectComponent;
    private hookTypeSelectComponent: SelectComponent;
    private inputComponent: InputComponent;
    private currentLanguage: Language | undefined;
    private currentConfig: Config | undefined;
    private containerElement: HTMLElement | null = null;
    
    constructor() {
        this.componentId = 'global-options-component-' + Math.random().toString(36).substring(2, 10);
        // 初始化基础组件
        this.tipsComponent = new TipsComponent();
        this.checkboxComponent = new CheckboxComponent();
        this.languageSelectComponent = new SelectComponent();
        this.hookTypeSelectComponent = new SelectComponent();
        this.inputComponent = new InputComponent();
        
        this.appendStyles();
        
        // 订阅语言更新事件
        LanguageEventManager.getInstance().subscribe(this.componentId, this.updateLanguage.bind(this));
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
        style.appendChild(document.createTextNode(globalOptionsStyles));
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
        this.currentLanguage = language;
        this.currentConfig = oldConfig;
        
        // 确保样式已添加
        this.appendStyles();
        
        // 创建容器
        this.containerElement = createGlobalOptionsContainer(language);
        
        // 获取表格元素
        const table = this.containerElement.querySelector('.global-options-table');
        if (!table) {
            globalOptionsLogger.error('无法找到表格元素');
            return this.containerElement;
        }
        
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
        
        const languageSelect = this.languageSelectComponent.render(
            'js-script-hook-global-config-language',
            languageOptions,
            oldConfig.language,
            undefined,
            async (value: string) => {
                await handleLanguageSelect(value, oldConfig);
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
        
        const hookTypeSelect = this.hookTypeSelectComponent.render(
            'js-script-hook-global-config-hook-type',
            hookTypeOptions,
            oldConfig.hookType,
            undefined,
            (value: string) => {
                handleHookTypeSelect(value, oldConfig);
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
        
        // 前缀输入框
        const prefixInputCell = document.createElement('td');
        prefixInputCell.setAttribute('align', 'left');
        
        const prefixInput = this.inputComponent.render(
            'js-script-hook-global-config-prefix',
            oldConfig.prefix,
            language.global_settings.flagPrefixPlaceholder,
            undefined,
            (value: string) => {
                handlePrefixInput(value, oldConfig);
            }
        );
        
        const prefixContainer = document.createElement('div');
        prefixContainer.style.width = '380px';
        prefixContainer.appendChild(prefixInput);
        
        prefixInputCell.appendChild(prefixContainer);
        prefixRow.appendChild(prefixInputCell);
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
                handleIgnoreJsSuffixCheckbox(isChecked, oldConfig);
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
                handleIgnoreNotJsonpCheckbox(isChecked, oldConfig);
            }
        );
        
        ignoreNotJsonpField.appendChild(ignoreNotJsonpCheckbox);
        ignoreNotJsonpRow.appendChild(ignoreNotJsonpField);
        table.appendChild(ignoreNotJsonpRow);
        
        return this.containerElement;
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
        if (!this.containerElement || !this.currentConfig) {
            return;
        }

        try {
            this.currentLanguage = language;
            
            // 更新标题
            const legend = this.containerElement.querySelector('.global-options-legend');
            if (legend) {
                legend.textContent = language.global_settings.title;
            }

            // 更新表格内容
            const table = this.containerElement.querySelector('.global-options-table');
            if (table) {
                const rows = table.querySelectorAll('tr');
                
                // 更新语言选项行
                const languageRow = rows[0];
                if (languageRow) {
                    const label = languageRow.querySelector('td[align="right"] span:last-child');
                    if (label) {
                        label.textContent = language.global_settings.language;
                    }
                    // 更新语言选项的提示
                    const tips = languageRow.querySelector('.js-script-hook-tooltip');
                    if (tips) {
                        tips.textContent = language.global_settings.languageTips;
                    }
                    // 更新语言选项
                    const languageOptions = [
                        { value: 'english', text: 'English' },
                        { value: 'chinese', text: '简体中文' }
                    ];
                    const selectContainer = languageRow.querySelector('td[align="left"]');
                    if (selectContainer && this.languageSelectComponent) {
                        this.languageSelectComponent.updateOptions(languageOptions);
                    }
                }

                // 更新Hook类型行
                const hookTypeRow = rows[1];
                if (hookTypeRow) {
                    const label = hookTypeRow.querySelector('td[align="right"] span:last-child');
                    if (label) {
                        label.textContent = language.global_settings.responseDebuggerHookType;
                    }
                    // 更新Hook类型的提示
                    const tips = hookTypeRow.querySelector('.js-script-hook-tooltip');
                    if (tips) {
                        tips.textContent = language.global_settings.responseDebuggerHookTypeTips;
                    }
                    // 更新Hook类型的选项
                    const hookTypeOptions = [
                        { value: 'use-proxy-function', text: language.global_settings.responseDebuggerHookTypeUseProxyFunction },
                        { value: 'use-redeclare-function', text: language.global_settings.responseDebuggerHookTypeUseRedeclareFunction }
                    ];
                    const selectContainer = hookTypeRow.querySelector('td[align="left"] .js-script-hook-custom-select');
                    if (selectContainer && this.hookTypeSelectComponent) {
                        this.hookTypeSelectComponent.updateOptions(hookTypeOptions);
                    }
                }

                // 更新前缀行
                const prefixRow = rows[2];
                if (prefixRow) {
                    const label = prefixRow.querySelector('td[align="right"] span:last-child');
                    if (label) {
                        label.textContent = language.global_settings.flagPrefix;
                    }
                    // 更新前缀的提示
                    const tips = prefixRow.querySelector('.js-script-hook-tooltip');
                    if (tips) {
                        tips.textContent = language.global_settings.flagPrefixTips;
                    }
                    // 更新前缀输入框的占位符
                    if (this.inputComponent) {
                        this.inputComponent.setPlaceholder(language.global_settings.flagPrefixPlaceholder);
                        globalOptionsLogger.debug(`设置前缀输入框占位符为: ${language.global_settings.flagPrefixPlaceholder}`);
                    }
                }

                // 更新忽略.js请求行
                const ignoreJsRow = rows[3];
                if (ignoreJsRow) {
                    const label = ignoreJsRow.querySelector('td[align="right"] span:last-child');
                    if (label) {
                        label.textContent = language.global_settings.isIgnoreJsSuffixRequest;
                    }
                    // 更新忽略.js请求的提示
                    const tips = ignoreJsRow.querySelector('.js-script-hook-tooltip');
                    if (tips) {
                        tips.textContent = language.global_settings.isIgnoreJsSuffixRequestTips;
                    }
                }

                // 更新忽略非JSONP请求行
                const ignoreNotJsonpRow = rows[4];
                if (ignoreNotJsonpRow) {
                    const label = ignoreNotJsonpRow.querySelector('td[align="right"] span:last-child');
                    if (label) {
                        label.textContent = language.global_settings.isIgnoreNotJsonpRequest;
                    }
                    // 更新忽略非JSONP请求的提示
                    const tips = ignoreNotJsonpRow.querySelector('.js-script-hook-tooltip');
                    if (tips) {
                        tips.textContent = language.global_settings.isIgnoreNotJsonpRequestTips;
                    }
                }
            }

            // 更新子组件的语言
            if (this.tipsComponent) {
                this.tipsComponent.updateLanguage(language);
            }
            if (this.languageSelectComponent) {
                this.languageSelectComponent.updateLanguage(language);
            }
            if (this.hookTypeSelectComponent) {
                this.hookTypeSelectComponent.updateLanguage(language);
            }
            if (this.inputComponent) {
                this.inputComponent.updateLanguage(language);
            }
            if (this.checkboxComponent) {
                this.checkboxComponent.updateLanguage(language);
            }

        } catch (error) {
            globalOptionsLogger.error(`更新全局选项组件语言时出错: ${error}`);
        }
    }

    /**
     * 组件销毁时取消订阅并清理资源
     */
    public destroy(): void {
        try {
            // 取消语言更新订阅
            LanguageEventManager.getInstance().unsubscribe(this.componentId);
            
            // 销毁子组件
            if (this.tipsComponent) {
                this.tipsComponent.destroy();
            }
            if (this.languageSelectComponent) {
                this.languageSelectComponent.destroy();
            }
            if (this.hookTypeSelectComponent) {
                this.hookTypeSelectComponent.destroy();
            }
            if (this.inputComponent) {
                this.inputComponent.destroy();
            }
            if (this.checkboxComponent) {
                this.checkboxComponent.destroy();
            }

            // 移除样式
            const styleElement = document.getElementById('global-options-component-style');
            if (styleElement) {
                styleElement.remove();
            }

            // 移除DOM元素
            if (this.containerElement) {
                this.containerElement.remove();
                this.containerElement = null;
            }

            // 清理引用
            this.currentConfig = undefined;
            this.currentLanguage = undefined;
        } catch (error) {
            globalOptionsLogger.error(`销毁全局选项组件时出错: ${error}`);
        }
    }
} 