import { jQuery as $, JQuery } from '../utils/jquery-adapter';
import { safeSetInnerHTML, safeCreateElementFromHTML } from '../../../../utils/dom-utils';
import { createLogger } from '../../../../logger';

// 创建Tab组件专用的日志记录器
const tabLogger = createLogger('tab-component');

/**
 * 标签页项目接口
 */
export interface TabItem {
    id?: string;          // 标签页ID
    title: string;        // 标签页标题
    content: JQuery<HTMLElement>;  // 标签页内容
    active?: boolean;     // 是否激活
    icon?: string;        // 图标HTML
}

/**
 * 标签页组件
 */
export class TabComponent {
    private readonly styleCSS: string;

    /**
     * 生成唯一ID
     */
    private static generateId(): string {
        return 'tab-' + Math.random().toString(36).substring(2, 10);
    }

    constructor() {
        this.styleCSS = `
            /* 标签页容器样式 */
            .js-script-hook-tabs-container {
                width: 100%;
                margin-bottom: 20px;
            }
            
            /* 标签页头部 */
            .js-script-hook-tabs-header {
                display: flex;
                background-color: #f8f9fa;
                border-bottom: 1px solid #dee2e6;
                margin-bottom: 15px;
                border-radius: 4px 4px 0 0;
            }
            
            /* 单个标签页 */
            .js-script-hook-tab {
                padding: 10px 15px;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                font-size: 14px;
                color: #495057;
                border: 1px solid transparent;
                border-bottom: none;
                margin-bottom: -1px;
                border-radius: 4px 4px 0 0;
            }
            
            /* 标签页图标 */
            .js-script-hook-tab-icon {
                width: 16px;
                height: 16px;
                margin-right: 8px;
                display: inline-flex;
            }
            
            /* 标签页图标中的SVG样式 */
            .js-script-hook-tab-icon svg {
                width: 16px;
                height: 16px;
            }
            
            /* 鼠标悬停效果 */
            .js-script-hook-tab:hover {
                background-color: #f1f1f1;
                border-color: #f1f1f1 #f1f1f1 #fff;
            }
            
            /* 激活状态 */
            .js-script-hook-tab.active {
                color: #007bff;
                background-color: #fff;
                border-color: #dee2e6 #dee2e6 #fff;
                border-top: 2px solid #007bff;
                padding-top: 9px;
                font-weight: 500;
            }
            
            /* 标签页内容区域 */
            .js-script-hook-tabs-content {
                padding: 15px 0;
            }
            
            /* 单个标签页内容 */
            .js-script-hook-tab-content {
                display: none;
                animation: fadeIn 0.3s ease forwards;
            }
            
            /* 显示激活的标签页内容 */
            .js-script-hook-tab-content.active {
                display: block;
            }
            
            /* 淡入动画 */
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        
        this.appendStyles();
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
        style.appendChild(document.createTextNode(this.styleCSS));
        document.head.appendChild(style);
    }

    /**
     * 渲染标签页组件
     * @param tabs 标签页列表
     * @returns jQuery对象
     */
    render(tabs: TabItem[]): JQuery<HTMLElement> {
        // 确保样式已添加
        this.appendStyles();
        
        // 创建容器元素
        const containerElement = document.createElement('div');
        containerElement.className = 'js-script-hook-tabs-container';
        
        // 创建标签页头部
        const tabsHeaderElement = document.createElement('div');
        tabsHeaderElement.className = 'js-script-hook-tabs-header';
        containerElement.appendChild(tabsHeaderElement);
        
        // 创建标签页内容区域
        const tabsContentElement = document.createElement('div');
        tabsContentElement.className = 'js-script-hook-tabs-content';
        containerElement.appendChild(tabsContentElement);
        
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
                let tabContent = '';
                if (tab.icon) {
                    tabContent += `<span class="js-script-hook-tab-icon">${tab.icon}</span>`;
                }
                tabContent += tab.title;
                
                // 安全设置HTML内容
                safeSetInnerHTML(tabElement, tabContent);
                tabsHeaderElement.appendChild(tabElement);
                
                // 创建标签页内容容器
                const contentElement = document.createElement('div');
                contentElement.className = `js-script-hook-tab-content ${isActive ? 'active' : ''}`;
                contentElement.id = `tab-content-${tabId}`;
                
                // 添加内容（jQuery对象）
                contentElement.appendChild(tab.content[0]);
                tabsContentElement.appendChild(contentElement);
                
                // 添加点击事件
                tabElement.addEventListener('click', function() {
                    // 移除所有标签页的激活状态
                    const allTabs = tabsHeaderElement.querySelectorAll('.js-script-hook-tab');
                    allTabs.forEach(t => t.classList.remove('active'));
                    
                    const allContents = tabsContentElement.querySelectorAll('.js-script-hook-tab-content');
                    allContents.forEach(c => c.classList.remove('active'));
                    
                    // 激活当前点击的标签页
                    tabElement.classList.add('active');
                    const targetContent = document.getElementById(`tab-content-${tabId}`);
                    if (targetContent) {
                        targetContent.classList.add('active');
                    }
                });
            } catch (error) {
                tabLogger.error(`为标签页 ${tab.id || index} 创建DOM元素失败: ${error}`);
            }
        });
        
        // 将DOM元素包装为jQuery对象返回
        return $(containerElement);
    }
} 