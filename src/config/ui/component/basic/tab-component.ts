import $ from 'jquery';

export type TabItem = {
    id: string;
    title: string;
    content: JQuery<HTMLElement>;
    active?: boolean;
    icon?: string;
};

export class TabComponent {
    private readonly styleCSS: string;
    private static idCounter: number = 0;
    
    constructor() {
        this.styleCSS = `
        .js-script-hook-tabs-container {
            width: 100%;
            margin-bottom: 20px;
        }
        
        .js-script-hook-tabs-header {
            display: flex;
            border-bottom: 1px solid #ddd;
            margin-bottom: 15px;
            background-color: #f8f8f8;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
        }
        
        .js-script-hook-tab {
            padding: 10px 15px;
            cursor: pointer;
            position: relative;
            font-size: 14px;
            font-weight: 500;
            color: #606266;
            transition: all 0.3s;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            margin-right: 2px;
            margin-bottom: -1px;
            display: flex;
            align-items: center;
        }
        
        .js-script-hook-tab:hover {
            background-color: #f0f0f0;
            color: #409EFF;
        }
        
        .js-script-hook-tab.active {
            color: #409EFF;
            background-color: #fff;
            border: 1px solid #ddd;
            border-bottom-color: #fff;
        }
        
        .js-script-hook-tab-content {
            display: none;
            padding: 15px 0;
        }
        
        .js-script-hook-tab-content.active {
            display: block;
            animation: fadeIn 0.3s ease;
        }
        
        .js-script-hook-tab-icon {
            margin-right: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 16px;
            height: 16px;
        }
        
        .js-script-hook-tab-icon svg {
            width: 16px;
            height: 16px;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        `;
    }
    
    /**
     * 添加组件样式到页面
     */
    private appendStyles(): void {
        // 避免重复插入
        if (document.getElementById("tab-component-style")) {
            return;
        }
        
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "tab-component-style";
        style.appendChild(document.createTextNode(this.styleCSS));
        document.head.appendChild(style);
    }
    
    /**
     * 生成唯一ID
     */
    private static generateId(): string {
        return `js-script-hook-tab-${++TabComponent.idCounter}`;
    }
    
    /**
     * 渲染标签页组件
     * @param tabs 标签页列表
     * @returns jQuery对象
     */
    render(tabs: TabItem[]): JQuery<HTMLElement> {
        // 确保样式已添加
        this.appendStyles();
        
        // 创建容器
        const container = $('<div class="js-script-hook-tabs-container"></div>');
        
        // 创建标签页头部
        const tabsHeader = $('<div class="js-script-hook-tabs-header"></div>');
        container.append(tabsHeader);
        
        // 创建标签页内容区域
        const tabsContent = $('<div class="js-script-hook-tabs-content"></div>');
        container.append(tabsContent);
        
        // 确保至少有一个标签页是激活的
        let hasActiveTab = tabs.some(tab => tab.active);
        if (!hasActiveTab && tabs.length > 0) {
            tabs[0].active = true;
        }
        
        // 添加标签页
        tabs.forEach((tab, index) => {
            const tabId = tab.id || TabComponent.generateId();
            const isActive = tab.active === true;
            
            // 创建标签页头
            let tabHTML = '';
            if (tab.icon) {
                tabHTML += `<span class="js-script-hook-tab-icon">${tab.icon}</span>`;
            }
            tabHTML += tab.title;
            
            const tabElement = $(`<div class="js-script-hook-tab ${isActive ? 'active' : ''}" data-tab-id="${tabId}">${tabHTML}</div>`);
            tabsHeader.append(tabElement);
            
            // 创建标签页内容
            const contentElement = $(`<div class="js-script-hook-tab-content ${isActive ? 'active' : ''}" id="tab-content-${tabId}"></div>`);
            contentElement.append(tab.content);
            tabsContent.append(contentElement);
            
            // 添加点击事件
            tabElement.on('click', function() {
                // 移除所有标签页的激活状态
                tabsHeader.find('.js-script-hook-tab').removeClass('active');
                tabsContent.find('.js-script-hook-tab-content').removeClass('active');
                
                // 激活当前点击的标签页
                $(this).addClass('active');
                $(`#tab-content-${tabId}`).addClass('active');
            });
        });
        
        return container;
    }
} 