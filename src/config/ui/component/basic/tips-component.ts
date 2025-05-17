import { createLogger } from "../../../../logger";
import { LanguageUpdateable } from '../language-updateable';
import { Language } from '../language';
import { LanguageEventManager } from '../language-event-manager';

// 创建Tips组件专用的日志记录器
const tipsLogger = createLogger('tips-component');

export class TipsComponent implements LanguageUpdateable {
    private readonly styleCSS: string;
    private readonly componentId: string;
    private currentTipText: string = '';
    private containerElement: HTMLElement | null = null;

    constructor() {
        this.componentId = 'tips-component-' + Math.random().toString(36).substring(2, 10);
        this.styleCSS = `
            /* 提示图标容器样式 */
            .js-script-hook-tips-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background-color: #007bff;
                color: white;
                font-size: 12px;
                font-weight: bold;
                cursor: help;
                margin-left: 5px;
                position: relative;
                vertical-align: middle;
            }
            
            /* 工具提示样式 */
            .js-script-hook-tooltip {
                visibility: hidden;
                position: absolute;
                bottom: 125%;
                left: 50%;
                transform: translateX(-50%);
                background-color: #333;
                color: white;
                text-align: center;
                padding: 6px 10px;
                border-radius: 4px;
                width: max-content;
                max-width: 250px;
                font-size: 12px;
                z-index: 1000;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                opacity: 0;
                transition: opacity 0.3s;
                pointer-events: none;
                white-space: normal;
                line-height: 1.4;
            }
            
            /* 工具提示箭头 */
            .js-script-hook-tooltip::after {
                content: "";
                position: absolute;
                top: 100%;
                left: 50%;
                margin-left: -5px;
                border-width: 5px;
                border-style: solid;
                border-color: #333 transparent transparent transparent;
            }
            
            /* 显示工具提示 */
            .js-script-hook-tips-icon:hover .js-script-hook-tooltip {
                visibility: visible;
                opacity: 1;
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
        if (document.getElementById("tips-component-style")) {
            return;
        }

        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "tips-component-style";
        style.appendChild(document.createTextNode(this.styleCSS));
        document.head.appendChild(style);
    }

    /**
     * 渲染提示图标组件
     * @param tipText 提示文本
     * @returns HTMLElement
     */
    render(tipText: string): HTMLElement {
        // 保存当前的提示文本
        this.currentTipText = tipText;
        
        // 确保样式已添加
        this.appendStyles();
        
        try {
            // 创建提示图标容器
            this.containerElement = document.createElement('div');
            this.containerElement.className = 'js-script-hook-tips-icon';
            this.containerElement.textContent = '?';
            
            // 创建工具提示
            const tooltip = document.createElement('div');
            tooltip.className = 'js-script-hook-tooltip';
            tooltip.textContent = tipText;
            
            // 组装组件
            this.containerElement.appendChild(tooltip);
            
            return this.containerElement;
        } catch (error) {
            tipsLogger.error(`渲染提示图标失败: ${error}`);
            
            // 降级处理：创建一个简单的提示图标
            const fallbackElement = document.createElement('span');
            fallbackElement.textContent = '?';
            fallbackElement.title = tipText;
            fallbackElement.style.cursor = 'help';
            this.containerElement = fallbackElement;
            return fallbackElement;
        }
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
        if (!this.containerElement || !this.currentTipText) {
            return;
        }

        try {
            // 更新工具提示文本
            const tooltip = this.containerElement.querySelector('.js-script-hook-tooltip');
            if (tooltip) {
                tooltip.textContent = this.currentTipText;
            } else if (this.containerElement.title) {
                // 如果是降级版本的提示图标
                this.containerElement.title = this.currentTipText;
            }
        } catch (error) {
            tipsLogger.error(`更新提示文本时出错: ${error}`);
        }
    }

    /**
     * 组件销毁时取消订阅
     */
    public destroy(): void {
        LanguageEventManager.getInstance().unsubscribe(this.componentId);
    }
} 