import { jQuery as $, JQuery } from './utils/jquery-adapter';
import { GlobalOptionsComponent } from "./global-options-component";
import { DebuggerManagerComponent } from "./debugger-manager-component";
import { AboutComponent } from "./about-component";
import { getGlobalConfig } from "../../config";
import { getLanguage, type Language } from "./language";
import { TabComponent, TabItem } from "./basic";
import { safeCreateElementFromHTML, safeSetInnerHTML } from "../../../utils/dom-utils";
import { createLogger } from "../../../logger";

// 创建配置组件专用的日志记录器
const configUILogger = createLogger('config-ui');

/**
 * 配置组件
 */
export class ConfigurationComponent {
    private readonly modalHTML: string;
    private readonly styleCSS: string;
    private tabComponent: TabComponent;

    // 添加图标字段
    private readonly debuggerListIcon: string;
    private readonly globalSettingsIcon: string;
    private readonly aboutIcon: string;

    constructor() {
        this.tabComponent = new TabComponent();
        
        // 初始化图标
        this.debuggerListIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 4H3"/>
            <path d="M21 8H3"/>
            <path d="M21 12H3"/>
            <path d="M21 16H3"/>
            <path d="M21 20H3"/>
            <circle cx="7" cy="8" r="2.5" fill="#ff5252" stroke="none"/>
        </svg>`;
        
        this.globalSettingsIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>`;
        
        this.aboutIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
        </svg>`;

        this.styleCSS = `
        /* 配置窗口基本样式 */
        #jsrei-js-script-hook-configuration-modal-window {
            display: none;
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.85);
            z-index: 2147483646;
            overflow-y: auto;
        }
        
        /* 可滚动区域样式 */
        .js-script-hook-scrollable-div {
            width: 860px;
            padding: 30px 40px;
            margin: 10px auto;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 8px;
            box-shadow: 0 6px 16px rgba(0,0,0,0.2);
            max-width: 80%;
            z-index: 99999999999;
            max-height: 800px;
            overflow-y: auto;
        }
        
        /* 内容区居中对齐 */
        #js-script-hook-configuration-content {
            color: black;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        /* 关闭按钮样式 */
        #jsrei-js-script-hook-configuration-close-btn {
            position: absolute;
            right: 15px;
            top: 15px;
            cursor: pointer;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #999;
            background-color: white;
            border-radius: 50%;
            font-size: 24px;
            color: #888;
            transition: all 0.2s ease;
            z-index: 1000;
            transform: rotate(0deg);
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        
        #jsrei-js-script-hook-configuration-close-btn:hover {
            color: #555;
            background-color: #f0f0f0;
            border-color: #666;
            transform: rotate(90deg);
            box-shadow: 0 3px 7px rgba(0,0,0,0.3);
        }
        
        #jsrei-js-script-hook-configuration-close-btn:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(153, 153, 153, 0.4);
        }
        
        #jsrei-js-script-hook-configuration-close-btn:active {
            transform: scale(0.9) rotate(90deg);
        }
        `;

        this.modalHTML = `
        <div id="jsrei-js-script-hook-configuration-modal-window">
            <div class="js-script-hook-scrollable-div">
                <button id="jsrei-js-script-hook-configuration-close-btn" title="关闭">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <div id="js-script-hook-configuration-content"></div>
            </div>
        </div>
    `;
    }

    /**
     * 展示配置界面
     */
    public show(): void {
        // 检查是否已经存在配置窗口
        const existingModal = document.getElementById("jsrei-js-script-hook-configuration-modal-window");
        if (existingModal) {
            configUILogger.debug('配置窗口已经打开，不再创建新窗口');
            
            // 如果窗口已存在但不可见，则显示它
            if ($(existingModal).css('display') === 'none') {
                $(existingModal).show();
                configUILogger.debug('重新显示已存在的窗口');
            }
            
            // 使窗口有一个轻微闪动效果，引导用户注意
            $(existingModal).find('.js-script-hook-scrollable-div').css('box-shadow', '0 0 15px rgba(0,123,255,0.8)');
            setTimeout(() => {
                $(existingModal).find('.js-script-hook-scrollable-div').css('box-shadow', '0 6px 16px rgba(0,0,0,0.2)');
            }, 300);
            
            return;
        }
        
        // 添加样式
        this.appendStyles();
        
        // 确保UI元素已添加到页面
        this.appendUI();
        
        // i18n配置语言
        const language = getLanguage(getGlobalConfig().language);

        // 获取内容容器
        const contentContainer = document.getElementById('js-script-hook-configuration-content');
        if (!contentContainer) {
            configUILogger.error('无法找到内容容器元素');
            return;
        }
        
        // 设置关闭按钮文本
        const closeBtn = document.getElementById('jsrei-js-script-hook-configuration-close-btn');
        if (closeBtn) {
            closeBtn.setAttribute('title', language.confirm_dialog.closeWindow);
            
            // 添加关闭按钮事件
            closeBtn.addEventListener('click', () => {
                this.closeModalWindow();
            });
        }

        // 创建Tab页内容
        const tabItems: TabItem[] = [
            {
                id: 'debugger-list-tab',
                title: language.tabs.debuggerListTab,
                content: this.createDebuggerListTab(language),
                active: true,
                icon: this.debuggerListIcon
            },
            {
                id: 'global-settings-tab',
                title: language.tabs.globalSettingsTab,
                content: this.createGlobalSettingsTab(language),
                icon: this.globalSettingsIcon
            },
            {
                id: 'about-tab',
                title: language.tabs.aboutTab,
                content: this.createAboutTab(language),
                icon: this.aboutIcon
            }
        ];

        // 渲染标签组件
        const tabsContainer = this.tabComponent.render(tabItems);
        
        // 清空内容容器并添加标签组件
        while (contentContainer.firstChild) {
            contentContainer.removeChild(contentContainer.firstChild);
        }
        
        contentContainer.appendChild(tabsContainer[0]);
        
        // 显示模态窗口
        const modalWindow = document.getElementById('jsrei-js-script-hook-configuration-modal-window');
        if (modalWindow) {
            $(modalWindow).show();
        }
        
        configUILogger.debug('配置界面已显示');
    }

    /**
     * 获取断点列表图标
     * @returns 断点列表图标SVG字符串
     */
    public getDebuggerListIcon(): string {
        return this.debuggerListIcon;
    }
    
    /**
     * 获取全局设置图标
     * @returns 全局设置图标SVG字符串
     */
    public getGlobalSettingsIcon(): string {
        return this.globalSettingsIcon;
    }
    
    /**
     * 获取关于图标
     * @returns 关于图标SVG字符串
     */
    public getAboutIcon(): string {
        return this.aboutIcon;
    }

    /**
     * 创建断点列表Tab页内容
     * @param language 语言配置
     * @returns 断点列表jQuery对象
     */
    public createDebuggerListTab(language: Language): JQuery<HTMLElement> {
        const debuggerManager = new DebuggerManagerComponent();
        return debuggerManager.render(language, getGlobalConfig().debuggers);
    }

    /**
     * 创建全局设置Tab页内容
     * @param language 语言配置
     * @returns 全局设置jQuery对象
     */
    public createGlobalSettingsTab(language: Language): JQuery<HTMLElement> {
        const globalOptionsComponent = new GlobalOptionsComponent();
        return globalOptionsComponent.render(language, getGlobalConfig());
    }

    /**
     * 创建关于Tab页内容
     * @param language 语言配置
     * @returns 关于页面jQuery对象
     */
    public createAboutTab(language: Language): JQuery<HTMLElement> {
        const aboutComponent = new AboutComponent();
        return aboutComponent.render(language);
    }

    /**
     * 添加组件样式到页面中
     */
    private appendStyles(): void {
        // 避免重复插入
        if (document.getElementById("configuration-component-style")) {
            return;
        }

        // 创建一个 <style> 元素
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "configuration-component-style";
        
        // 将 CSS 规则添加到 <style> 元素
        style.appendChild(document.createTextNode(this.styleCSS));
        
        // 将 <style> 元素插入到 <head> 中
        document.head.appendChild(style);
    }

    /**
     * 隐藏模态框的函数
     */
    private closeModalWindow(): void {
        const element = document.getElementById("jsrei-js-script-hook-configuration-modal-window");
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    /**
     * 将UI元素添加到页面中
     */
    private appendUI(): void {
        const modalRoot = document.getElementById('js-script-hook-modal-root');
        
        // 如果已经存在则不重复创建
        if (modalRoot) {
            configUILogger.debug('模态框DOM已存在，无需再次创建');
            return;
        }
        
        configUILogger.debug('开始创建配置界面DOM');
        
        try {
            // 使用安全方法创建DOM元素
            const fragmentContainer = document.createElement('div');
            const fragment = safeCreateElementFromHTML(this.modalHTML);
            fragmentContainer.appendChild(fragment);
            
            // 创建一个根容器，将模态框模板添加到其中
            const rootElement = document.createElement('div');
            rootElement.id = 'js-script-hook-modal-root';
            document.body.appendChild(rootElement);
            
            // 安全地将HTML内容设置到根元素
            safeSetInnerHTML(rootElement, fragmentContainer.innerHTML);
            
            configUILogger.debug('配置界面DOM创建成功');
        } catch (error) {
            configUILogger.error(`创建配置界面DOM失败: ${error}`);
            
            // 降级方案：创建一个基本的模态框元素
            try {
                const basicModal = document.createElement('div');
                basicModal.id = 'js-script-hook-modal-root';
                basicModal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;';
                
                const modalContent = document.createElement('div');
                modalContent.style.cssText = 'background:white;padding:20px;border-radius:5px;max-width:80%;max-height:80%;overflow:auto;';
                modalContent.textContent = '配置界面加载失败，请刷新页面重试。';
                
                basicModal.appendChild(modalContent);
                document.body.appendChild(basicModal);
                
                configUILogger.warn('使用降级方案创建了简化版配置界面');
            } catch (fallbackError) {
                configUILogger.error(`降级方案也失败了: ${fallbackError}`);
            }
        }
    }
} 