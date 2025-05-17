import { Language } from "../../language";
import { LanguageUpdateable, LanguageEventManager } from "../../language-event";
import { createLogger } from "../../../../../logger";
import { TabItem } from "./types";
import { tabStyles } from "./styles";

// 创建Tab组件专用的日志记录器
const tabLogger = createLogger('tab-component');

/**
 * 标签页组件
 */
export class TabComponent implements LanguageUpdateable {
    private readonly componentId: string;
    private currentTabs: TabItem[] = [];
    private containerElement: HTMLElement | null = null;

    /**
     * 生成唯一ID
     */
    private static generateId(): string {
        return 'tab-' + Math.random().toString(36).substring(2, 10);
    }

    constructor() {
        this.componentId = 'tab-component-' + TabComponent.generateId();
        
        this.appendStyles();
        // 订阅语言更新事件
        LanguageEventManager.getInstance().subscribe(this.componentId, this.updateLanguage.bind(this));
    }

    /**
     * 添加样式到页面
     */
    private appendStyles(): void {
        if (document.getElementById("js-script-hook-tabs-style")) {
            return;
        }
        
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "js-script-hook-tabs-style";
        style.appendChild(document.createTextNode(tabStyles));
        document.head.appendChild(style);
    }

    /**
     * 渲染标签页组件
     * @param tabs 标签页列表
     * @returns HTMLElement
     */
    render(tabs: TabItem[]): HTMLElement {
        // 保存当前的标签页配置
        this.currentTabs = tabs;
        
        // 确保样式已添加
        this.appendStyles();
        
        // 创建容器元素
        this.containerElement = document.createElement('div');
        this.containerElement.className = 'js-script-hook-tabs-container';
        
        // 创建标签页头部
        const tabsHeaderElement = document.createElement('div');
        tabsHeaderElement.className = 'js-script-hook-tabs-header';
        this.containerElement.appendChild(tabsHeaderElement);
        
        // 创建标签页内容区域
        const tabsContentElement = document.createElement('div');
        tabsContentElement.className = 'js-script-hook-tabs-content';
        this.containerElement.appendChild(tabsContentElement);
        
        // 确保至少有一个标签页是激活的
        let hasActiveTab = tabs.some(tab => tab.active);
        if (!hasActiveTab && tabs.length > 0) {
            tabs[0].active = true;
        }
        
        // 添加标签页
        tabs.forEach((tab, index) => {
            try {
                const tabId = tab.id || TabComponent.generateId();
                const isActive = tab.active === true;
                
                // 创建标签页头
                const tabElement = document.createElement('div');
                tabElement.className = `js-script-hook-tab ${isActive ? 'active' : ''}`;
                tabElement.dataset.tabId = tabId;
                
                // 添加图标和标题
                if (tab.icon) {
                    const iconSpan = document.createElement('span');
                    iconSpan.className = 'js-script-hook-tab-icon';
                    iconSpan.innerHTML = tab.icon;
                    tabElement.appendChild(iconSpan);
                }
                
                const titleText = document.createTextNode(tab.title);
                tabElement.appendChild(titleText);
                
                tabsHeaderElement.appendChild(tabElement);
                
                // 创建标签页内容容器
                const contentElement = document.createElement('div');
                contentElement.className = `js-script-hook-tab-content ${isActive ? 'active' : ''}`;
                contentElement.id = `tab-content-${tabId}`;
                
                // 添加内容
                contentElement.appendChild(tab.content);
                tabsContentElement.appendChild(contentElement);
                
                // 添加点击事件
                tabElement.addEventListener('click', () => {
                    // 移除所有激活状态
                    const allTabs = tabsHeaderElement.querySelectorAll('.js-script-hook-tab');
                    allTabs.forEach(t => t.classList.remove('active'));
                    
                    const allContents = tabsContentElement.querySelectorAll('.js-script-hook-tab-content');
                    allContents.forEach(c => c.classList.remove('active'));
                    
                    // 激活当前标签页
                    tabElement.classList.add('active');
                    contentElement.classList.add('active');
                });
                
            } catch (error) {
                tabLogger.error(`创建标签页时出错: ${error}`);
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
        if (!this.containerElement || !this.currentTabs) {
            return;
        }

        try {
            // 更新标签页标题
            const tabElements = this.containerElement.querySelectorAll('.js-script-hook-tab');
            tabElements.forEach((tabElement, index) => {
                const tab = this.currentTabs[index];
                if (tab) {
                    // 保留图标
                    const iconSpan = tabElement.querySelector('.js-script-hook-tab-icon');
                    
                    // 清空内容
                    tabElement.textContent = '';
                    
                    // 重新添加图标（如果存在）
                    if (iconSpan) {
                        tabElement.appendChild(iconSpan);
                    }
                    
                    // 添加新的标题文本
                    tabElement.appendChild(document.createTextNode(tab.title));
                }
            });
        } catch (error) {
            tabLogger.error(`更新标签页语言时出错: ${error}`);
        }
    }

    /**
     * 组件销毁时取消订阅
     */
    public destroy(): void {
        // 取消语言更新订阅
        LanguageEventManager.getInstance().unsubscribe(this.componentId);

        // 移除样式
        const styleElement = document.getElementById("js-script-hook-tabs-style");
        if (styleElement) {
            styleElement.remove();
        }
    }
}