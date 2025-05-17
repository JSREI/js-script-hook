/**
 * 下拉选择框组件 - 原生JavaScript实现
 */

import { LanguageUpdateable } from '../language-updateable';
import { Language } from '../language';
import { LanguageEventManager } from '../language-event-manager';
import { createLogger } from '../../../../logger';

// 创建Select组件专用的日志记录器
const selectLogger = createLogger('select-component');

export type SelectOption = {
    value: string;
    text: string;
};

export class SelectComponent implements LanguageUpdateable {
    private readonly styleCSS: string;
    private readonly componentId: string;
    private static idCounter: number = 0;
    private currentOptions: SelectOption[] = [];
    private currentSelectedValue: string = '';
    private currentLabel?: string;
    private containerElement: HTMLElement | null = null;
    
    constructor() {
        this.componentId = 'select-component-' + SelectComponent.generateId();
        this.styleCSS = `
        .js-script-hook-select-container {
            position: relative;
            margin: 8px 0;
            width: 100%;
        }
        
        .js-script-hook-select-label {
            font-size: 13px;
            font-weight: 500;
            color: #606266;
            margin-bottom: 6px;
            display: block;
        }
        
        .js-script-hook-custom-select {
            position: relative;
            width: 100%;
            cursor: pointer;
        }
        
        .js-script-hook-selected-option {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #dcdfe6;
            border-radius: 6px;
            box-sizing: border-box;
            font-size: 14px;
            color: #333;
            background-color: white;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .js-script-hook-selected-option:hover {
            border-color: #c0c4cc;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .js-script-hook-selected-option.active {
            border-color: #409EFF;
            box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
        }
        
        .js-script-hook-selected-text {
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .js-script-hook-select-arrow {
            color: #409EFF;
            margin-left: 8px;
            transition: transform 0.3s;
        }
        
        .js-script-hook-select-arrow.open {
            transform: rotate(180deg);
        }
        
        .js-script-hook-options-container {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            max-height: 200px;
            overflow-y: auto;
            background-color: white;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
            margin-top: 5px;
            z-index: 1000;
            display: none;
        }
        
        .js-script-hook-options-container.open {
            display: block;
        }
        
        .js-script-hook-option {
            padding: 10px 12px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .js-script-hook-option:hover {
            background-color: #f5f7fa;
        }
        
        .js-script-hook-option.selected {
            background-color: #ecf5ff;
            color: #409EFF;
            font-weight: 500;
        }
        
        /* 隐藏原生select */
        .js-script-hook-select-native {
            position: absolute;
            opacity: 0;
            pointer-events: none;
            height: 0;
            width: 0;
            overflow: hidden;
        }
        `;
        
        this.appendStyles();
        
        // 订阅语言更新事件
        LanguageEventManager.getInstance().subscribe(this.componentId, this.updateLanguage.bind(this));
    }
    
    /**
     * 添加组件样式到页面
     */
    private appendStyles(): void {
        // 避免重复插入
        if (document.getElementById("select-component-style")) {
            return;
        }
        
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "select-component-style";
        style.appendChild(document.createTextNode(this.styleCSS));
        document.head.appendChild(style);
    }
    
    /**
     * 生成唯一ID
     */
    private static generateId(): string {
        return `js-script-hook-select-${++SelectComponent.idCounter}`;
    }
    
    /**
     * 渲染下拉选择框组件
     * @param id 选择框ID
     * @param options 选项列表
     * @param selectedValue 选中的值
     * @param label 标签文本（可选）
     * @param onChange 值变更回调（可选）
     * @returns HTMLElement
     */
    render(
        id: string, 
        options: SelectOption[],
        selectedValue: string = '',
        label?: string,
        onChange?: (value: string) => void
    ): HTMLElement {
        // 保存当前状态
        this.currentOptions = options;
        this.currentSelectedValue = selectedValue;
        this.currentLabel = label;
        
        // 确保样式已添加
        this.appendStyles();
        
        // 为了确保ID唯一性，给id添加一个唯一标识符
        const uniqueId = id || SelectComponent.generateId();
        
        // 创建选择框容器
        this.containerElement = document.createElement('div');
        this.containerElement.className = 'js-script-hook-select-container';
        
        // 如果有标签，添加标签
        if (label) {
            const labelElement = document.createElement('label');
            labelElement.className = 'js-script-hook-select-label';
            labelElement.setAttribute('for', uniqueId);
            labelElement.textContent = label;
            this.containerElement.appendChild(labelElement);
        }
        
        // 查找默认选中的文本
        const selectedOption = options.find(opt => opt.value === selectedValue) || options[0];
        const selectedText = selectedOption ? selectedOption.text : '';
        
        // 创建自定义下拉框结构
        const customSelect = document.createElement('div');
        customSelect.className = 'js-script-hook-custom-select';
        
        // 选中的选项显示区域
        const selectedDiv = document.createElement('div');
        selectedDiv.className = 'js-script-hook-selected-option';
        selectedDiv.setAttribute('data-value', selectedValue || '');
        
        const selectedTextSpan = document.createElement('span');
        selectedTextSpan.className = 'js-script-hook-selected-text';
        selectedTextSpan.textContent = selectedText;
        
        const arrowSpan = document.createElement('span');
        arrowSpan.className = 'js-script-hook-select-arrow';
        arrowSpan.innerHTML = '▼';
        
        selectedDiv.appendChild(selectedTextSpan);
        selectedDiv.appendChild(arrowSpan);
        
        // 选项列表容器
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'js-script-hook-options-container';
        
        // 添加选项
        options.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.className = `js-script-hook-option ${option.value === selectedValue ? 'selected' : ''}`;
            optionDiv.setAttribute('data-value', option.value);
            optionDiv.textContent = option.text;
            
            // 点击选项时的处理
            optionDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                const value = option.value;
                
                // 更新选中状态
                selectedTextSpan.textContent = option.text;
                selectedDiv.setAttribute('data-value', value);
                
                // 更新选项的选中状态
                optionsContainer.querySelectorAll('.js-script-hook-option').forEach(opt => {
                    opt.classList.toggle('selected', opt === optionDiv);
                });
                
                // 关闭下拉框
                optionsContainer.classList.remove('open');
                selectedDiv.classList.remove('active');
                arrowSpan.classList.remove('open');
                
                // 触发回调
                if (onChange) {
                    onChange(value);
                }
            });
            
            optionsContainer.appendChild(optionDiv);
        });
        
        // 点击选中区域时显示/隐藏选项列表
        selectedDiv.addEventListener('click', () => {
            const isOpen = optionsContainer.classList.contains('open');
            optionsContainer.classList.toggle('open');
            selectedDiv.classList.toggle('active');
            arrowSpan.classList.toggle('open');
            
            // 如果打开了下拉框，添加点击外部关闭的处理
            if (!isOpen) {
                const closeHandler = (e: MouseEvent) => {
                    if (!customSelect.contains(e.target as Node)) {
                        optionsContainer.classList.remove('open');
                        selectedDiv.classList.remove('active');
                        arrowSpan.classList.remove('open');
                        document.removeEventListener('click', closeHandler);
                    }
                };
                
                // 延迟添加事件监听，避免立即触发
                setTimeout(() => {
                    document.addEventListener('click', closeHandler);
                }, 0);
            }
        });
        
        customSelect.appendChild(selectedDiv);
        customSelect.appendChild(optionsContainer);
        
        this.containerElement.appendChild(customSelect);
        
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
        if (!this.containerElement || !this.currentOptions) {
            return;
        }

        try {
            // 更新标签文本（如果有）
            if (this.currentLabel) {
                const labelElement = this.containerElement.querySelector('.js-script-hook-select-label');
                if (labelElement) {
                    labelElement.textContent = this.currentLabel;
                }
            }

            // 更新选中的文本
            const selectedTextSpan = this.containerElement.querySelector('.js-script-hook-selected-text');
            const selectedOption = this.currentOptions.find(opt => opt.value === this.currentSelectedValue);
            if (selectedTextSpan && selectedOption) {
                selectedTextSpan.textContent = selectedOption.text;
            }

            // 更新选项列表
            const optionsContainer = this.containerElement.querySelector('.js-script-hook-options-container');
            if (optionsContainer) {
                const options = optionsContainer.querySelectorAll('.js-script-hook-option');
                options.forEach((optionElement) => {
                    const value = optionElement.getAttribute('data-value');
                    const option = this.currentOptions.find(opt => opt.value === value);
                    if (option) {
                        optionElement.textContent = option.text;
                    }
                });
            }
        } catch (error) {
            selectLogger.error(`更新选择框语言时出错: ${error}`);
        }
    }

    /**
     * 组件销毁时取消订阅
     */
    public destroy(): void {
        LanguageEventManager.getInstance().unsubscribe(this.componentId);
    }
} 