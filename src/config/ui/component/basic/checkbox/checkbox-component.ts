import { Language } from "../../language";
import { LanguageUpdateable, LanguageEventManager } from "../../language-event";
import { createLogger } from "../../../../../logger";
import { CheckboxType } from "./types";
import { checkboxStyles } from "./styles";

// 创建Checkbox组件专用的日志记录器
const checkboxLogger = createLogger('checkbox-component');

/**
 * 复选框组件
 */
export class CheckboxComponent implements LanguageUpdateable {
    private readonly componentId: string;
    private currentLabel?: string;
    private containerElement: HTMLElement | null = null;
    
    constructor() {
        this.componentId = 'checkbox-component-' + Math.random().toString(36).substring(2, 10);
        
        this.appendStyles();
        
        // 订阅语言更新事件
        LanguageEventManager.getInstance().subscribe(this.componentId, this.updateLanguage.bind(this));
    }
    
    /**
     * 添加组件样式到页面
     */
    private appendStyles(): void {
        // 避免重复插入
        if (document.getElementById("checkbox-component-style")) {
            return;
        }
        
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "checkbox-component-style";
        style.appendChild(document.createTextNode(checkboxStyles));
        document.head.appendChild(style);
    }
    
    /**
     * 渲染复选框或开关组件
     * @param id 复选框ID
     * @param isChecked 是否选中
     * @param onChange 改变事件回调
     * @param type 组件类型：'checkbox'为标准复选框，'switch'为滑动开关
     * @param label 标签文本（可选）
     * @returns HTMLElement
     */
    render(
        id: string, 
        isChecked: boolean, 
        onChange?: (isChecked: boolean) => void,
        type: CheckboxType = 'checkbox',
        label?: string
    ): HTMLElement {
        // 保存当前标签文本
        this.currentLabel = label;
        
        // 确保样式已添加
        this.appendStyles();
        
        // 创建外层容器
        this.containerElement = document.createElement('div');
        this.containerElement.style.display = 'inline-flex';
        this.containerElement.style.alignItems = 'center';
        
        // 创建label元素作为复选框容器
        const checkboxLabel = document.createElement('label');
        checkboxLabel.className = type === 'switch' ? 'js-script-hook-switch-container' : 'js-script-hook-checkbox-container';
        
        // 创建input元素
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = id;
        if (type === 'checkbox') {
            input.className = 'js-script-hook-input';
        }
        input.checked = isChecked;
        
        // 创建自定义样式的span元素
        const span = document.createElement('span');
        span.className = type === 'switch' ? 'js-script-hook-switch-slider' : 'js-script-hook-custom-checkbox';
        
        // 添加事件处理
        if (onChange) {
            input.addEventListener('change', (e) => {
                const target = e.target as HTMLInputElement;
                onChange(target.checked);
            });
        }
        
        // 组装复选框部分
        checkboxLabel.appendChild(input);
        checkboxLabel.appendChild(span);
        this.containerElement.appendChild(checkboxLabel);
        
        // 如果有标签文本，添加标签
        if (label) {
            const textLabel = document.createElement('label');
            textLabel.htmlFor = id;
            textLabel.className = 'js-script-hook-checkbox-label';
            textLabel.textContent = label;
            this.containerElement.appendChild(textLabel);
        }
        
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
        if (!this.containerElement || !this.currentLabel) {
            return;
        }

        try {
            // 更新标签文本
            const labelElement = this.containerElement.querySelector('.js-script-hook-checkbox-label');
            if (labelElement) {
                labelElement.textContent = this.currentLabel;
            }
        } catch (error) {
            checkboxLogger.error(`更新复选框语言时出错: ${error}`);
        }
    }

    /**
     * 组件销毁时取消订阅
     */
    public destroy(): void {
        LanguageEventManager.getInstance().unsubscribe(this.componentId);
    }
} 