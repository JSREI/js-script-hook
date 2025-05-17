import $ from 'jquery';
import { GlobalOptionsComponent } from "./global-options-component";
import { DebuggerManagerComponent } from "./debugger-manager-component";
import { getGlobalConfig } from "../../config";
import { getLanguage, type Language } from "./language";
import { TabComponent, TabItem } from "./basic";

/**
 * 配置组件
 */
export class ConfigurationComponent {
    private readonly modalHTML: string;
    private readonly styleCSS: string;
    private tabComponent: TabComponent;

    constructor() {
        this.tabComponent = new TabComponent();
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
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            background-color: transparent;
            border-radius: 50%;
            font-size: 24px;
            color: #666;
            transition: all 0.3s ease;
            z-index: 1000;
            transform: rotate(0deg);
        }
        
        #jsrei-js-script-hook-configuration-close-btn:hover {
            color: #f44336;
            background-color: rgba(244, 67, 54, 0.1);
            transform: rotate(90deg);
        }
        
        #jsrei-js-script-hook-configuration-close-btn:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.3);
        }
        
        #jsrei-js-script-hook-configuration-close-btn:active {
            transform: scale(0.9) rotate(90deg);
        }
        `;

        this.modalHTML = `
        <div id="jsrei-js-script-hook-configuration-modal-window">
            <div class="js-script-hook-scrollable-div">
                <button id="jsrei-js-script-hook-configuration-close-btn" title="关闭">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
        // 添加样式
        this.appendStyles();
        
        // i18n配置语言
        const language = getLanguage(getGlobalConfig().language);

        // 将模态框添加到body元素中
        $(document.body).append($(this.modalHTML));

        // 创建Tab页内容
        const tabItems: TabItem[] = [
            {
                id: 'debugger-list-tab',
                title: language.tabs.debuggerListTab,
                content: this.createDebuggerListTab(language),
                active: true
            },
            {
                id: 'global-settings-tab',
                title: language.tabs.globalSettingsTab,
                content: this.createGlobalSettingsTab(language)
            }
        ];

        // 渲染Tab组件
        const tabComponent = this.tabComponent.render(tabItems);
        $("#js-script-hook-configuration-content").append(tabComponent);

        // 关闭按钮事件处理
        $("#jsrei-js-script-hook-configuration-close-btn").click(() => this.closeModalWindow());
        
        // 显示模态框
        $("#jsrei-js-script-hook-configuration-modal-window").show();
    }

    /**
     * 创建断点列表Tab页内容
     * @param language 语言配置
     * @returns 断点列表jQuery对象
     */
    private createDebuggerListTab(language: Language): JQuery<HTMLElement> {
        const debuggerManager = new DebuggerManagerComponent();
        return debuggerManager.render(language, getGlobalConfig().debuggers);
    }

    /**
     * 创建全局设置Tab页内容
     * @param language 语言配置
     * @returns 全局设置jQuery对象
     */
    private createGlobalSettingsTab(language: Language): JQuery<HTMLElement> {
        const globalOptionsComponent = new GlobalOptionsComponent();
        return globalOptionsComponent.render(language, getGlobalConfig());
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
} 