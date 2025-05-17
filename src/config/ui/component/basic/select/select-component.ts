import { Language } from "../../language";
import { LanguageUpdateable, LanguageEventManager } from "../../language-event";
import { createLogger } from "../../../../../logger";
import { SelectOption } from "./types";
import { selectStyles } from "./styles";

// 创建Select组件专用的日志记录器
const selectLogger = createLogger('select-component');

/**
 * 下拉选择框组件
 */
export class SelectComponent implements LanguageUpdateable {
    private readonly componentId: string;
    private static idCounter: number = 0;
    private currentOptions: SelectOption[] = [];
    private currentSelectedValue: string = '';
    private currentLabel?: string;
    private containerElement: HTMLElement | null = null;
    private onChange?: (value: string) => void;
    
    constructor() {
        this.componentId = 'select-component-' + SelectComponent.generateId();
        
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
        style.appendChild(document.createTextNode(selectStyles));
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
        const language = LanguageEventManager.getInstance().getCurrentLanguage();
        
        // 保存当前状态
        this.currentOptions = options;
        this.currentSelectedValue = selectedValue;
        this.currentLabel = label;
        this.onChange = onChange;
        
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
            labelElement.textContent = label;
            this.containerElement.appendChild(labelElement);
        }
        
        // 创建自定义选择框
        const customSelect = document.createElement('div');
        customSelect.className = 'js-script-hook-custom-select';
        
        // 创建选中项显示区域
        const selectedOption = document.createElement('div');
        selectedOption.className = 'js-script-hook-selected-option';
        
        const selectedText = document.createElement('span');
        selectedText.className = 'js-script-hook-selected-text';
        
        // 设置选中项文本
        const selectedOptionData = options.find(opt => opt.value === selectedValue);
        selectedText.textContent = selectedOptionData ? selectedOptionData.text : (language?.basic.select.placeholder || 'Please select');
        
        const arrow = document.createElement('span');
        arrow.className = 'js-script-hook-select-arrow';
        arrow.innerHTML = '▼';
        
        selectedOption.appendChild(selectedText);
        selectedOption.appendChild(arrow);
        
        // 创建选项容器
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'js-script-hook-options-container';
        
        // 添加选项
        options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'js-script-hook-option';
            if (option.value === selectedValue) {
                optionElement.classList.add('selected');
            }
            optionElement.textContent = option.text;
            optionElement.dataset.value = option.value;
            optionElement.addEventListener('click', () => this.handleOptionClick(option.value));
            optionsContainer.appendChild(optionElement);
        });
        
        customSelect.appendChild(selectedOption);
        customSelect.appendChild(optionsContainer);
        
        // 添加原生select作为后备
        const nativeSelect = document.createElement('select');
        nativeSelect.className = 'js-script-hook-select-native';
        nativeSelect.id = uniqueId;
        
        options.forEach(option => {
            const optElement = document.createElement('option');
            optElement.value = option.value;
            optElement.textContent = option.text;
            if (option.value === selectedValue) {
                optElement.selected = true;
            }
            nativeSelect.appendChild(optElement);
        });
        
        this.containerElement.appendChild(customSelect);
        this.containerElement.appendChild(nativeSelect);
        
        // 添加点击事件处理
        selectedOption.addEventListener('click', () => {
            const isOpen = optionsContainer.classList.contains('open');
            if (!isOpen) {
                // 关闭其他打开的选择框
                document.querySelectorAll('.js-script-hook-options-container.open').forEach(container => {
                    if (container !== optionsContainer) {
                        container.classList.remove('open');
                        const arrow = container.previousElementSibling?.querySelector('.js-script-hook-select-arrow');
                        if (arrow) {
                            arrow.classList.remove('open');
                        }
                    }
                });
            }
            optionsContainer.classList.toggle('open');
            arrow.classList.toggle('open');
        });
        
        // 点击外部关闭选项列表
        document.addEventListener('click', (e: MouseEvent) => {
            if (!this.containerElement?.contains(e.target as Node)) {
                optionsContainer.classList.remove('open');
                arrow.classList.remove('open');
            }
        });
        
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

    /**
     * 更新选项列表
     * @param newOptions 新的选项列表
     */
    public updateOptions(newOptions: SelectOption[]): void {
        selectLogger.debug(`开始更新选项列表，新选项数量: ${newOptions.length}`);
        
        if (!this.containerElement || !newOptions.length) {
            selectLogger.error('容器元素不存在或新选项为空');
            return;
        }

        try {
            this.currentOptions = newOptions;
            const optionsContainer = this.containerElement.querySelector('.js-script-hook-options-container');
            if (!optionsContainer) {
                selectLogger.error('找不到选项容器元素');
                return;
            }

            selectLogger.debug('清空并重新创建选项');
            optionsContainer.innerHTML = '';
            newOptions.forEach(option => {
                selectLogger.debug(`创建选项: ${option.value} - ${option.text}`);
                const optionElement = document.createElement('div');
                optionElement.className = `js-script-hook-option${option.value === this.currentSelectedValue ? ' selected' : ''}`;
                optionElement.setAttribute('data-value', option.value);
                optionElement.textContent = option.text;
                
                optionElement.addEventListener('click', (e) => {
                    selectLogger.debug(`选项被点击: ${option.value}`);
                    e.stopPropagation();
                    this.handleOptionClick(option.value);
                });
                
                optionsContainer.appendChild(optionElement);
            });

            const selectedTextSpan = this.containerElement.querySelector('.js-script-hook-selected-text');
            const selectedOption = this.currentOptions.find(opt => opt.value === this.currentSelectedValue);
            if (selectedTextSpan && selectedOption) {
                selectLogger.debug(`更新当前选中文本: ${selectedOption.text}`);
                selectedTextSpan.textContent = selectedOption.text;
            } else {
                selectLogger.error('找不到选中文本元素或选中选项');
            }
        } catch (error) {
            selectLogger.error(`更新选项列表时出错: ${error}`);
        }
    }

    /**
     * 处理选项点击事件
     * @param value 选中的值
     */
    private async handleOptionClick(value: string): Promise<void> {
        selectLogger.debug(`开始处理选项点击事件，选中值: ${value}, 当前值: ${this.currentSelectedValue}`);
        
        if (this.currentSelectedValue === value) {
            selectLogger.debug('选中值与当前值相同，不处理');
            return;
        }

        selectLogger.debug('开始更新UI');
        this.updateSelectedValue(value);
        
        if (this.onChange) {
            try {
                selectLogger.debug(`准备执行onChange回调，value: ${value}`);
                await this.onChange(value);
                selectLogger.debug('onChange回调执行成功');
            } catch (error) {
                selectLogger.error(`选项变更回调执行失败: ${error}`);
                // 回调失败时恢复到原来的值
                selectLogger.debug(`回调失败，恢复到原值: ${this.currentSelectedValue}`);
                this.updateSelectedValue(this.currentSelectedValue);
            }
        } else {
            selectLogger.debug('没有onChange回调');
        }
    }

    /**
     * 更新选中的值和UI
     * @param value 新的值
     */
    private updateSelectedValue(value: string): void {
        selectLogger.debug(`开始更新选中值，value: ${value}`);
        
        // 先更新内部状态
        this.currentSelectedValue = value;
        
        // 确保有容器元素
        if (!this.containerElement) {
            selectLogger.error('容器元素不存在');
            return;
        }

        // 先找到所有需要的元素
        const optionsContainer = this.containerElement.querySelector('.js-script-hook-options-container');
        const selectedTextSpan = this.containerElement.querySelector('.js-script-hook-selected-text');
        const selectedDiv = this.containerElement.querySelector('.js-script-hook-selected-option');
        const arrowSpan = this.containerElement.querySelector('.js-script-hook-select-arrow');
        
        // 确保有选项列表
        if (!this.currentOptions || this.currentOptions.length === 0) {
            selectLogger.error('当前选项列表为空');
            return;
        }

        // 找到选中的选项
        const selectedOption = this.currentOptions.find(opt => opt.value === value);
        if (!selectedOption) {
            selectLogger.error(`找不到值为 ${value} 的选项`);
            return;
        }

        // 更新选项列表中的选中状态
        if (optionsContainer) {
            selectLogger.debug('更新选项列表中的选中状态');
            optionsContainer.querySelectorAll('.js-script-hook-option').forEach(option => {
                const optionValue = option.getAttribute('data-value');
                if (optionValue === value) {
                    option.classList.add('selected');
                } else {
                    option.classList.remove('selected');
                }
            });
            optionsContainer.classList.remove('open');
        }

        // 更新显示文本
        if (selectedTextSpan) {
            selectLogger.debug(`更新显示文本为: ${selectedOption.text}`);
            selectedTextSpan.textContent = selectedOption.text;
        }

        // 更新选中区域
        if (selectedDiv) {
            selectedDiv.setAttribute('data-value', value);
            selectedDiv.classList.remove('active');
        }

        // 更新箭头状态
        if (arrowSpan) {
            arrowSpan.classList.remove('open');
        }
    }
} 