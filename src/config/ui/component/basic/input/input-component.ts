import { Language } from "../../language";
import { LanguageUpdateable, LanguageEventManager } from "../../language-event";
import { createLogger } from "../../../../../logger";
import { inputStyles } from "./styles";

// 创建Input组件专用的日志记录器
const inputLogger = createLogger('input-component');

/**
 * 输入框组件
 */
export class InputComponent implements LanguageUpdateable {
    private currentPlaceholder?: string;
    private currentLabel?: string;
    private containerElement: HTMLElement | null = null;
    private componentId: string;
    
    constructor() {
        this.componentId = `input-component-${Math.random().toString(36).substr(2, 9)}`;
        
        this.appendStyles();
        
        // 订阅语言更新事件
        LanguageEventManager.getInstance().subscribe(this.componentId, this.updateLanguage.bind(this));
    }
    
    /**
     * 添加组件样式到页面
     */
    private appendStyles(): void {
        // 避免重复插入
        if (document.getElementById("input-component-style")) {
            return;
        }
        
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "input-component-style";
        style.appendChild(document.createTextNode(inputStyles));
        document.head.appendChild(style);
    }
    
    /**
     * 渲染输入框组件
     * @param id 输入框ID
     * @param placeholder 占位符文本
     * @param value 初始值
     * @param label 标签文本
     * @param onChange 值变化回调
     * @returns HTMLElement
     */
    render(id: string, placeholder?: string, value?: string, label?: string, onChange?: (value: string) => void): HTMLElement {
        this.currentPlaceholder = placeholder;
        this.currentLabel = label;

        // 确保样式已添加
        this.appendStyles();
        
        // 创建容器元素
        this.containerElement = document.createElement('div');
        this.containerElement.className = 'js-script-hook-input-container';
        
        // 如果有标签，创建标签元素
        if (label) {
            const labelElement = document.createElement('label');
            labelElement.className = 'js-script-hook-input-label';
            labelElement.setAttribute('for', id);
            labelElement.textContent = label;
            this.containerElement.appendChild(labelElement);
        }
        
        // 创建输入框元素
        const input = document.createElement('input');
        input.id = id;
        input.className = 'js-script-hook-input-field';
        input.type = 'text';
        if (placeholder) {
            input.placeholder = placeholder;
        }
        if (value !== undefined && value !== null && value !== '') {
            input.value = value;
        }
        
        // 添加事件处理
        if (onChange) {
            input.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement;
                onChange(target.value);
            });
        }
        
        this.containerElement.appendChild(input);
        
        return this.containerElement;
    }

    /**
     * 设置当前占位符文本
     * @param placeholder 新的占位符文本
     */
    public setPlaceholder(placeholder: string): void {
        this.currentPlaceholder = placeholder;
        
        // 立即更新DOM
        if (this.containerElement) {
            const input = this.containerElement.querySelector('.js-script-hook-input-field') as HTMLInputElement;
            if (input) {
                input.placeholder = placeholder;
            }
        }
    }

    /**
     * 更新组件的语言
     * @param language 新的语言配置
     */
    public updateLanguage(language: Language): void {
        if (!this.containerElement) {
            return;
        }

        try {
            // 更新标签文本
            if (this.currentLabel) {
                const labelElement = this.containerElement.querySelector('.js-script-hook-input-label');
                if (labelElement) {
                    labelElement.textContent = this.currentLabel;
                }
            }

            // 获取输入框元素
            const input = this.containerElement.querySelector('.js-script-hook-input-field') as HTMLInputElement;
            if (!input) {
                return;
            }

            // 根据输入框ID或当前placeholder识别特定类型的输入框，并应用正确的语言资源
            const inputId = input.id || '';
            const currentPlaceholder = input.placeholder || this.currentPlaceholder || '';

            // 处理URL匹配方式输入框
            if (inputId.includes('url-pattern-text') || 
                currentPlaceholder.includes('Enter a keyword or expression') ||
                currentPlaceholder.includes('输入关键字或者表达式')) {
                
                // 更新为当前语言的URL匹配方式占位符
                const newPlaceholder = language.debugger_config.urlPatternTextPlaceholder;
                input.placeholder = newPlaceholder;
                this.currentPlaceholder = newPlaceholder;
                inputLogger.debug(`识别为URL匹配方式输入框，更新占位符为: ${newPlaceholder}`);
                return;
            }
            
            // 处理JSONP回调函数参数名输入框
            if (inputId.includes('callback-function-param-name-text') || 
                currentPlaceholder.includes('If not specified, the built-in engine will automatically infer') ||
                currentPlaceholder.includes('不指定的话会使用内置引擎自动推测')) {
                
                // 更新为当前语言的JSONP回调函数参数名占位符
                const newPlaceholder = language.debugger_config.callbackFunctionParamNamePlaceholder;
                input.placeholder = newPlaceholder;
                this.currentPlaceholder = newPlaceholder;
                inputLogger.debug(`识别为JSONP回调函数参数名输入框，更新占位符为: ${newPlaceholder}`);
                return;
            }
            
            // 处理通用输入框 - 仅使用保存的占位符
            if (this.currentPlaceholder) {
                input.placeholder = this.currentPlaceholder;
                inputLogger.debug(`更新通用输入框占位符为: ${this.currentPlaceholder}`);
            }
        } catch (error) {
            inputLogger.error(`更新输入框语言时出错: ${error}`);
        }
    }

    /**
     * 销毁组件
     */
    public destroy(): void {
        // 取消语言更新订阅
        LanguageEventManager.getInstance().unsubscribe(this.componentId);
        
        // 移除样式
        const styleElement = document.getElementById('input-component-style');
        if (styleElement) {
            styleElement.remove();
        }

        // 清理容器
        if (this.containerElement) {
            this.containerElement.remove();
            this.containerElement = null;
        }
    }

    /**
     * 获取组件ID
     * @returns 组件的唯一标识符
     */
    public getComponentId(): string {
        return this.componentId;
    }
} 