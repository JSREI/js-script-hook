import { Language } from "../../language";
import { LanguageUpdateable, LanguageEventManager } from "../../language-event";
import { createLogger } from "../../../../../logger";
import { tipsStyles } from "./styles";

// 创建Tips组件专用的日志记录器
const tipsLogger = createLogger('tips-component');

/**
 * 提示组件
 */
export class TipsComponent implements LanguageUpdateable {
    private readonly componentId: string;
    private currentTipText: string = '';
    private containerElement: HTMLElement | null = null;

    constructor() {
        this.componentId = 'tips-component-' + Math.random().toString(36).substring(2, 10);
        
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
        style.appendChild(document.createTextNode(tipsStyles));
        document.head.appendChild(style);
    }

    /**
     * 为tooltip添加智能方向定位
     * 根据页面位置自动选择最佳显示方向
     * @param tipElement 提示元素
     */
    private setupSmartPositioning(tipElement: HTMLElement): void {
        if (!this.containerElement) return;
        
        // 监听鼠标悬停事件
        this.containerElement.addEventListener('mouseenter', () => {
            if (!this.containerElement) return;
            
            const tooltip = this.containerElement.querySelector('.js-script-hook-tooltip') as HTMLElement;
            if (!tooltip) return;
            
            // 先重置所有方向类
            tooltip.classList.remove('tooltip-top', 'tooltip-bottom', 'tooltip-left', 'tooltip-right');
            
            // 获取元素位置信息
            const rect = this.containerElement.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            
            // 检查是否有足够空间在各个方向显示
            const spaceAbove = rect.top;
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceLeft = rect.left;
            const spaceRight = window.innerWidth - rect.right;
            
            // 理想的tooltip高度和宽度
            const tooltipHeight = Math.min(tooltipRect.height, 300); // 最大高度300px
            const tooltipWidth = Math.min(tooltipRect.width, 300);   // 最大宽度300px
            
            // 决定最佳方向
            // 默认首选顶部
            if (spaceAbove >= tooltipHeight + 10) {
                tooltip.classList.add('tooltip-top');
            }
            // 其次考虑底部
            else if (spaceBelow >= tooltipHeight + 10) {
                tooltip.classList.add('tooltip-bottom');
            }
            // 再考虑右侧
            else if (spaceRight >= tooltipWidth + 10) {
                tooltip.classList.add('tooltip-right');
            }
            // 最后考虑左侧
            else if (spaceLeft >= tooltipWidth + 10) {
                tooltip.classList.add('tooltip-left');
            }
            // 如果四个方向都不理想，默认使用顶部
            else {
                tooltip.classList.add('tooltip-top');
            }
        });
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
            
            // 默认方向类
            tooltip.classList.add('tooltip-top');
            
            // 检测文本长度，为超长文本添加特殊类
            if (tipText && tipText.length > 150) {
                tooltip.classList.add('long-content');
            }
            
            // 支持HTML格式的提示内容（如带有<br>的内容）
            if (tipText.includes('<br>') || tipText.includes('<br/>') || 
                tipText.includes('<p>') || tipText.includes('<ul>')) {
                tooltip.innerHTML = tipText;
            } else {
                tooltip.textContent = tipText;
            }
            
            // 组装组件
            this.containerElement.appendChild(tooltip);
            
            // 设置智能定位
            this.setupSmartPositioning(tooltip);
            
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
                // 检测文本长度，为超长文本添加特殊类
                if (this.currentTipText && this.currentTipText.length > 150) {
                    tooltip.classList.add('long-content');
                } else {
                    tooltip.classList.remove('long-content');
                }
                
                // 支持HTML格式的提示内容
                if (this.currentTipText.includes('<br>') || this.currentTipText.includes('<br/>') || 
                    this.currentTipText.includes('<p>') || this.currentTipText.includes('<ul>')) {
                    tooltip.innerHTML = this.currentTipText;
                } else {
                    tooltip.textContent = this.currentTipText;
                }
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