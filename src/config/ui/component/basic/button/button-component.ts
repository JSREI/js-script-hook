import { Language } from "../../language";
import { LanguageUpdateable } from "../../language-event";
import { createLogger } from "../../../../../logger";
import { ButtonSize, ButtonType } from "./types";
import { buttonStyles } from "./styles";

// 创建按钮组件专用的日志记录器
const buttonLogger = createLogger('button-component');

/**
 * 按钮组件
 */
export class ButtonComponent implements LanguageUpdateable {
    private currentText?: string;
    private containerElement: HTMLButtonElement | null = null;
    private componentId: string;
    
    constructor() {
        this.componentId = `button-component-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * 获取组件ID
     * @returns 组件的唯一标识符
     */
    public getComponentId(): string {
        return this.componentId;
    }
    
    /**
     * 渲染按钮组件
     * @param id 按钮ID
     * @param text 按钮文本
     * @param onClick 点击回调
     * @param type 按钮类型
     * @param size 按钮大小
     * @param icon 按钮图标
     * @param disabled 是否禁用
     * @returns HTMLElement
     */
    render(
        id: string,
        text: string,
        onClick: () => void,
        type: ButtonType = 'primary',
        size: ButtonSize = 'medium',
        icon?: string,
        disabled: boolean = false
    ): HTMLElement {
        this.currentText = text;
        
        // 确保样式已添加
        this.appendStyles();
        
        // 创建容器
        const container = document.createElement('div');
        container.className = 'js-script-hook-button-container';
        
        // 创建按钮元素
        this.containerElement = document.createElement('button') as HTMLButtonElement;
        this.containerElement.id = id;
        this.containerElement.className = `js-script-hook-button ${type} ${size}`;
        
        if (disabled) {
            this.containerElement.classList.add('disabled');
            this.containerElement.disabled = true;
        }
        
        // 如果有图标，添加图标
        if (icon) {
            const iconSpan = document.createElement('span');
            iconSpan.className = 'js-script-hook-button-icon';
            iconSpan.innerHTML = icon;
            this.containerElement.appendChild(iconSpan);
        }
        
        // 添加文本节点
        const textNode = document.createTextNode(text);
        this.containerElement.appendChild(textNode);
        
        // 添加点击事件
        this.containerElement.addEventListener('click', onClick);
        
        container.appendChild(this.containerElement);
        
        return container;
    }
    
    /**
     * 更新组件的语言
     * @param language 新的语言配置
     */
    public updateLanguage(language: Language): void {
        if (!this.containerElement || !this.currentText) {
            return;
        }

        try {
            // 更新按钮文本
            this.containerElement.textContent = this.currentText;
        } catch (error) {
            buttonLogger.error(`更新按钮语言时出错: ${error}`);
        }
    }
    
    /**
     * 添加组件样式到页面
     */
    private appendStyles(): void {
        // 避免重复插入
        if (document.getElementById("button-component-style")) {
            return;
        }
        
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "button-component-style";
        style.appendChild(document.createTextNode(buttonStyles));
        document.head.appendChild(style);
    }
    
    /**
     * 销毁组件
     */
    public destroy(): void {
        // 移除样式
        const styleElement = document.getElementById('button-component-style');
        if (styleElement) {
            styleElement.remove();
        }

        // 清理容器
        if (this.containerElement) {
            this.containerElement.remove();
            this.containerElement = null;
        }
    }
} 