import { createLogger } from "../../../../logger";

// 创建Tips组件专用的日志记录器
const tipsLogger = createLogger('tips-component');

export class TipsComponent {
    private readonly styleCSS: string;

    constructor() {
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
        // 确保样式已添加
        this.appendStyles();
        
        try {
            // 创建提示图标容器
            const container = document.createElement('div');
            container.className = 'js-script-hook-tips-icon';
            container.textContent = '?';
            
            // 创建工具提示
            const tooltip = document.createElement('div');
            tooltip.className = 'js-script-hook-tooltip';
            tooltip.textContent = tipText;
            
            // 组装组件
            container.appendChild(tooltip);
            
            return container;
        } catch (error) {
            tipsLogger.error(`渲染提示图标失败: ${error}`);
            
            // 降级处理：创建一个简单的提示图标
            const fallbackElement = document.createElement('span');
            fallbackElement.textContent = '?';
            fallbackElement.title = tipText;
            fallbackElement.style.cursor = 'help';
            return fallbackElement;
        }
    }
} 