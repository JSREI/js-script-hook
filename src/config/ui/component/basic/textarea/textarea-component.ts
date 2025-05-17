import { Language } from '../../language';
import { LanguageUpdateable, LanguageEventManager } from '../../language-event';
import { createLogger } from '../../../../../logger';
import { textareaStyles } from './styles';

const logger = createLogger('TextareaComponent');

/**
 * 文本域组件，支持多语言更新
 */
export class TextareaComponent implements LanguageUpdateable {
    private currentPlaceholder: string;
    private currentLabel: string;
    private containerElement: HTMLDivElement;
    private componentId: string;
    private maxLength: number;
    private showCounter: boolean;
    private textareaElement: HTMLTextAreaElement;
    private counterElement: HTMLDivElement;
    private static stylesAppended = false;

    /**
     * 构造函数
     * @param id 组件ID
     * @param name 组件名称
     * @param placeholder 占位符文本
     * @param value 初始值
     * @param onChange 值变更回调
     * @param maxLength 最大长度限制
     * @param showCounter 是否显示计数器
     */
    constructor(
        id: string,
        name: string,
        placeholder: string,
        value: string,
        onChange: (value: string) => void,
        maxLength?: number,
        showCounter: boolean = true
    ) {
        this.componentId = `textarea-${id}-${Math.floor(Math.random() * 1000000)}`;
        this.currentLabel = name;
        this.currentPlaceholder = placeholder;
        this.maxLength = maxLength;
        this.showCounter = showCounter;
        
        // 添加样式
        this.appendStyles();
        
        // 创建元素
        this.containerElement = document.createElement('div');
        this.containerElement.className = 'js-script-hook-textarea-container';
        this.containerElement.id = this.componentId;
        
        this.render(value, onChange);
        
        // 订阅语言更新事件
        LanguageEventManager.getInstance().subscribe(this.componentId, (language: Language) => {
            this.updateLanguage(language);
        });
    }

    /**
     * 添加样式，确保只添加一次
     */
    private appendStyles(): void {
        if (TextareaComponent.stylesAppended) {
            return;
        }

        const style = document.createElement('style');
        style.innerHTML = textareaStyles;
        document.head.appendChild(style);
        TextareaComponent.stylesAppended = true;
    }

    /**
     * 渲染组件
     * @param value 初始值
     * @param onChange 值变更回调
     */
    private render(value: string, onChange: (value: string) => void): void {
        // 创建标签
        const label = document.createElement('label');
        label.className = 'js-script-hook-textarea-label';
        label.textContent = this.currentLabel;
        this.containerElement.appendChild(label);

        // 创建文本域
        this.textareaElement = document.createElement('textarea');
        this.textareaElement.className = 'js-script-hook-textarea-field';
        this.textareaElement.placeholder = this.currentPlaceholder;
        this.textareaElement.value = value;
        
        if (this.maxLength) {
            this.textareaElement.maxLength = this.maxLength;
        }

        this.textareaElement.addEventListener('input', (e) => {
            const target = e.target as HTMLTextAreaElement;
            onChange(target.value);
            
            // 更新计数器
            if (this.showCounter && this.counterElement) {
                const currentLength = target.value.length;
                if (this.maxLength) {
                    this.counterElement.textContent = `${currentLength}/${this.maxLength}`;
                } else {
                    this.counterElement.textContent = `${currentLength}`;
                }
            }
        });

        this.containerElement.appendChild(this.textareaElement);

        // 创建计数器
        if (this.showCounter) {
            this.counterElement = document.createElement('div');
            this.counterElement.className = 'js-script-hook-textarea-counter';
            
            if (this.maxLength) {
                this.counterElement.textContent = `${value.length}/${this.maxLength}`;
            } else {
                this.counterElement.textContent = `${value.length}`;
            }
            
            this.containerElement.appendChild(this.counterElement);
        }
    }

    /**
     * 获取组件DOM元素
     */
    public getDomElement(): HTMLDivElement {
        return this.containerElement;
    }

    /**
     * 设置占位符文本
     * @param placeholder 占位符
     */
    public setPlaceholder(placeholder: string): void {
        this.currentPlaceholder = placeholder;
        const textareaElement = this.containerElement.querySelector('.js-script-hook-textarea-field') as HTMLTextAreaElement;
        if (textareaElement) {
            textareaElement.placeholder = placeholder;
        }
    }

    /**
     * 更新组件语言
     * @param language 当前语言
     */
    public updateLanguage(language: Language): void {
        try {
            if (!this.containerElement) {
                return;
            }
            
            // 更新标签文本
            const labelElement = this.containerElement.querySelector('.js-script-hook-textarea-label');
            if (labelElement && this.currentLabel) {
                labelElement.textContent = this.currentLabel;
            }
            
            // 更新文本区域的 placeholder
            const textareaElement = this.containerElement.querySelector('.js-script-hook-textarea-field') as HTMLTextAreaElement;
            if (textareaElement) {
                // 根据当前placeholder的内容判断其类型并更新
                const currentPlaceholder = textareaElement.placeholder;
                
                // 如果是备注区域的placeholder
                if (currentPlaceholder.includes('A good memory') || 
                    currentPlaceholder.includes('好记性不如烂笔头')) {
                    textareaElement.placeholder = language.debugger_config.commentPlaceholder;
                } 
                // 其他类型的placeholder保持不变
                else {
                    textareaElement.placeholder = this.currentPlaceholder;
                }
            }
        } catch (error) {
            logger.error(`更新文本区域语言时出错: ${error}`);
        }
    }

    /**
     * 销毁组件
     */
    public destroy(): void {
        // 取消订阅语言更新
        LanguageEventManager.getInstance().unsubscribe(this.componentId);
        
        // 移除容器元素
        if (this.containerElement && this.containerElement.parentNode) {
            this.containerElement.parentNode.removeChild(this.containerElement);
        }
    }

    /**
     * 获取组件ID
     */
    public getComponentId(): string {
        return this.componentId;
    }
} 