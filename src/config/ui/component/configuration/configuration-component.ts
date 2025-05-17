/**
 * 配置组件 - 用于显示配置界面
 */
import { GlobalOptionsComponent } from "../global-options";
import { DebuggerManagerComponent } from "../debugger-manager";
import { AboutComponent } from "../about";
import { getGlobalConfig } from "../../../config";
import { getLanguage, type Language } from "../language";
import { TabComponent, TabItem } from "../basic/tab";
import { createLogger } from "../../../../logger";
import { LanguageUpdateable, LanguageEventManager } from "../language-event";
import { configurationStyles } from "./styles";
import { debuggerListIcon, globalSettingsIcon, aboutIcon } from "./icons";
import { configurationTemplate } from "./template";

// 创建配置组件专用的日志记录器
const configUILogger = createLogger('config-ui');

/**
 * 配置组件
 */
export class ConfigurationComponent implements LanguageUpdateable {
    private tabComponent: TabComponent;
    private readonly componentId: string;
    private currentLanguage: Language | undefined;

    constructor() {
        this.componentId = 'configuration-component-' + Math.random().toString(36).substring(2, 10);
        this.tabComponent = new TabComponent();
        
        // 订阅语言更新事件
        LanguageEventManager.getInstance().subscribe(this.componentId, this.updateLanguage.bind(this));
    }

    /**
     * 展示配置界面
     */
    public show(): void {
        configUILogger.debug('准备打开配置窗口...');
        
        // 检查是否已经存在配置窗口
        const existingModal = document.getElementById("jsrei-js-script-hook-configuration-modal-window");
        if (existingModal) {
            configUILogger.debug('配置窗口已经存在于DOM中');
            
            // 如果窗口已存在但不可见，则显示它
            if (existingModal.style.display === 'none') {
                configUILogger.debug('窗口存在但不可见，将其显示');
                existingModal.style.display = 'block';
                
                // 重新验证内容容器是否存在
                const contentContainer = document.getElementById('js-script-hook-configuration-content');
                if (!contentContainer) {
                    configUILogger.error('无法找到内容容器元素，尝试重新创建整个配置界面');
                    // 如果内容容器不存在，我们需要先删除现有的模态框，然后重建
                    existingModal.remove();
                    // 清除modal-root并重新创建
                    const modalRoot = document.getElementById('js-script-hook-modal-root');
                    if (modalRoot) {
                        modalRoot.remove();
                    }
                    // 继续执行后面的创建逻辑
                } else {
                    configUILogger.debug('重新显示已存在的窗口，内容容器正常');
                    
                    // 使窗口有一个轻微闪动效果，引导用户注意
                    const scrollableDiv = existingModal.querySelector('.js-script-hook-scrollable-div') as HTMLElement;
                    if (scrollableDiv) {
                        scrollableDiv.style.setProperty('box-shadow', '0 0 15px rgba(0,123,255,0.8)');
                        setTimeout(() => {
                            scrollableDiv.style.setProperty('box-shadow', '0 6px 16px rgba(0,0,0,0.2)');
                        }, 300);
                    }
                    
                    return;
                }
            } else {
                // 窗口已经可见，只做闪动效果
                configUILogger.debug('窗口已经可见，不再创建新窗口');
                
                // 使窗口有一个轻微闪动效果，引导用户注意
                const scrollableDiv = existingModal.querySelector('.js-script-hook-scrollable-div') as HTMLElement;
                if (scrollableDiv) {
                    scrollableDiv.style.setProperty('box-shadow', '0 0 15px rgba(0,123,255,0.8)');
                    setTimeout(() => {
                        scrollableDiv.style.setProperty('box-shadow', '0 6px 16px rgba(0,0,0,0.2)');
                    }, 300);
                }
                
                return;
            }
        }
        
        // 添加样式
        configUILogger.debug('开始添加样式...');
        this.appendStyles();
        configUILogger.debug('样式添加完成');
        
        // 确保UI元素已添加到页面
        configUILogger.debug('开始添加UI元素...');
        this.appendUI();
        
        configUILogger.debug('获取语言配置...');
        // i18n配置语言
        const language = getLanguage(getGlobalConfig().language);

        // 获取内容容器
        configUILogger.debug('查找内容容器元素...');
        const contentContainer = document.getElementById('js-script-hook-configuration-content');
        if (!contentContainer) {
            configUILogger.error('无法找到内容容器元素，无法继续显示配置界面');
            return;
        }
        configUILogger.debug('找到内容容器元素');
        
        // 设置关闭按钮文本
        configUILogger.debug('设置关闭按钮...');
        const closeBtn = document.getElementById('jsrei-js-script-hook-configuration-close-btn');
        if (closeBtn) {
            closeBtn.setAttribute('title', language.basic.closeButton);
            
            // 添加关闭按钮事件
            configUILogger.debug('为关闭按钮添加事件监听器');
            closeBtn.addEventListener('click', () => {
                this.closeModalWindow();
            });
        } else {
            configUILogger.warn('未找到关闭按钮元素');
        }

        // 创建Tab页内容
        configUILogger.debug('开始创建Tab页内容...');
        const tabItems: TabItem[] = [
            {
                id: 'debugger-list-tab',
                title: language.tabs.debuggerListTab,
                content: this.createDebuggerListTab(language),
                active: true,
                icon: debuggerListIcon
            },
            {
                id: 'global-settings-tab',
                title: language.tabs.globalSettingsTab,
                content: this.createGlobalSettingsTab(language),
                icon: globalSettingsIcon
            },
            {
                id: 'about-tab',
                title: language.tabs.aboutTab,
                content: this.createAboutTab(language),
                icon: aboutIcon
            }
        ];

        // 渲染标签组件
        configUILogger.debug('渲染Tab组件...');
        const tabsContainer = this.tabComponent.render(tabItems);
        configUILogger.debug('Tab组件渲染完成');
        
        // 清空内容容器并添加标签组件
        configUILogger.debug('清空内容容器...');
        while (contentContainer.firstChild) {
            contentContainer.removeChild(contentContainer.firstChild);
        }
        
        configUILogger.debug('将Tab组件添加到内容容器...');
        try {
            contentContainer.appendChild(tabsContainer);
            configUILogger.debug('Tab组件成功添加到内容容器');
        } catch (error) {
            configUILogger.error(`添加Tab组件时出错: ${error}`);
        }
        
        // 显示模态窗口
        configUILogger.debug('显示模态窗口...');
        const modalWindow = document.getElementById('jsrei-js-script-hook-configuration-modal-window');
        if (modalWindow) {
            try {
                modalWindow.style.display = 'block';
                configUILogger.debug('模态窗口显示成功');
            } catch (error) {
                configUILogger.error(`显示模态窗口时出错: ${error}`);
            }
        } else {
            configUILogger.error('未找到模态窗口元素，无法显示');
        }
        
        configUILogger.debug('配置界面显示流程完成');
    }

    /**
     * 获取断点列表图标
     * @returns 断点列表图标SVG字符串
     */
    public getDebuggerListIcon(): string {
        return debuggerListIcon;
    }
    
    /**
     * 获取全局设置图标
     * @returns 全局设置图标SVG字符串
     */
    public getGlobalSettingsIcon(): string {
        return globalSettingsIcon;
    }
    
    /**
     * 获取关于图标
     * @returns 关于图标SVG字符串
     */
    public getAboutIcon(): string {
        return aboutIcon;
    }

    /**
     * 创建断点列表Tab页内容
     * @param language 语言配置
     * @returns HTMLElement
     */
    public createDebuggerListTab(language: Language): HTMLElement {
        const debuggerManager = new DebuggerManagerComponent();
        return debuggerManager.render(language, getGlobalConfig().debuggers);
    }

    /**
     * 创建全局设置Tab页内容
     * @param language 语言配置
     * @returns HTMLElement
     */
    public createGlobalSettingsTab(language: Language): HTMLElement {
        const globalOptionsComponent = new GlobalOptionsComponent();
        return globalOptionsComponent.render(language, getGlobalConfig());
    }

    /**
     * 创建关于Tab页内容
     * @param language 语言配置
     * @returns HTMLElement
     */
    public createAboutTab(language: Language): HTMLElement {
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
        style.appendChild(document.createTextNode(configurationStyles));
        
        // 将 <style> 元素插入到 <head> 中
        document.head.appendChild(style);
    }

    /**
     * 隐藏模态框的函数
     */
    private closeModalWindow(): void {
        const element = document.getElementById("jsrei-js-script-hook-configuration-modal-window");
        if (element) {
            // 不再从DOM中移除元素，而是仅仅隐藏它
            element.style.display = 'none';
            configUILogger.debug('配置窗口已隐藏，但保留在DOM中以便稍后重用');
        } else {
            configUILogger.warn('尝试关闭模态窗口但未找到元素');
        }
    }

    /**
     * 将UI元素添加到页面中
     */
    private appendUI(): void {
        configUILogger.debug('开始添加UI元素到页面...');
        
        const modalRoot = document.getElementById('js-script-hook-modal-root');
        
        // 如果已经存在则不重复创建
        if (modalRoot) {
            configUILogger.debug('模态框DOM已存在，无需再次创建');
            return;
        }
        
        configUILogger.debug('开始创建配置界面DOM');
        
        try {
            // 创建根容器
            const rootElement = document.createElement('div');
            rootElement.id = 'js-script-hook-modal-root';
            
            // 创建临时容器并设置HTML
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = configurationTemplate;
            
            // 将模态框内容添加到根容器
            while (tempContainer.firstChild) {
                rootElement.appendChild(tempContainer.firstChild);
            }
            
            // 将根容器添加到页面
            document.body.appendChild(rootElement);
            
            configUILogger.debug('配置界面DOM创建成功');
        } catch (error) {
            configUILogger.error(`创建配置界面DOM失败: ${error}`);
            
            // 获取更详细的错误信息
            if (error instanceof Error) {
                configUILogger.error(`错误名称: ${error.name}`);
                configUILogger.error(`错误消息: ${error.message}`);
                configUILogger.error(`错误堆栈: ${error.stack}`);
            }
            
            // 降级方案：创建一个基本的模态框元素
            try {
                configUILogger.warn('使用降级方案创建简化版配置界面');
                const basicModal = document.createElement('div');
                basicModal.id = 'js-script-hook-modal-root';
                basicModal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;';
                
                const modalContent = document.createElement('div');
                modalContent.style.cssText = 'background:white;padding:20px;border-radius:5px;max-width:80%;max-height:80%;overflow:auto;';
                modalContent.textContent = '配置界面加载失败，请刷新页面重试。';
                
                basicModal.appendChild(modalContent);
                document.body.appendChild(basicModal);
                
                configUILogger.warn('简化版配置界面创建成功');
            } catch (fallbackError) {
                configUILogger.error(`降级方案也失败了: ${fallbackError}`);
            }
        }
    }

    /**
     * 实现LanguageUpdateable接口的getComponentId方法
     */
    public getComponentId(): string {
        return this.componentId;
    }

    /**
     * 实现LanguageUpdateable接口的updateLanguage方法
     * @param language 新的语言
     */
    public updateLanguage(language: Language): void {
        configUILogger.debug('配置组件接收到语言更新通知');
        this.currentLanguage = language;
        
        try {
            // 更新当前标签页的标题
            if (this.tabComponent) {
                const tabItems: TabItem[] = [
                    {
                        id: 'debugger-list-tab',
                        title: language.tabs.debuggerListTab,
                        content: this.createDebuggerListTab(language),
                        active: true,
                        icon: debuggerListIcon
                    },
                    {
                        id: 'global-settings-tab',
                        title: language.tabs.globalSettingsTab,
                        content: this.createGlobalSettingsTab(language),
                        icon: globalSettingsIcon
                    },
                    {
                        id: 'about-tab',
                        title: language.tabs.aboutTab,
                        content: this.createAboutTab(language),
                        icon: aboutIcon
                    }
                ];
                
                // 递归查找表格标题元素
                const existingModal = document.getElementById("jsrei-js-script-hook-configuration-modal-window");
                if (existingModal && existingModal.style.display !== 'none') {
                    configUILogger.debug('找到活动的配置窗口，更新标签页标题');
                    
                    // 更新标签页的标题文本
                    if ((this.tabComponent as any).currentTabs) {
                        // 直接更新标签页组件的当前标签数据
                        (this.tabComponent as any).currentTabs[0].title = language.tabs.debuggerListTab;
                        (this.tabComponent as any).currentTabs[1].title = language.tabs.globalSettingsTab;
                        (this.tabComponent as any).currentTabs[2].title = language.tabs.aboutTab;
                        
                        // 显式调用TabComponent的updateLanguage方法
                        (this.tabComponent as any).updateLanguage(language);
                        configUILogger.debug('已更新标签页标题');
                    }
                    
                    // 更新关闭按钮的标题
                    const closeBtn = existingModal.querySelector('#jsrei-js-script-hook-configuration-close-btn');
                    if (closeBtn) {
                        closeBtn.setAttribute('title', language.basic.closeButton);
                    }
                }
            }
            
        } catch (error) {
            configUILogger.error(`更新配置组件语言时出错: ${error}`);
            
            // 如果更新失败，则退回到重新渲染整个界面
            configUILogger.warn('尝试通过重新渲染整个界面来修复语言更新');
            const existingModal = document.getElementById("jsrei-js-script-hook-configuration-modal-window");
            if (existingModal && existingModal.style.display !== 'none') {
                configUILogger.debug('配置窗口已打开，重新渲染');
                this.show();
            }
        }
    }

    /**
     * 销毁组件
     */
    public destroy(): void {
        configUILogger.debug('开始销毁配置组件...');
        
        // 取消语言更新订阅
        LanguageEventManager.getInstance().unsubscribe(this.componentId);
        configUILogger.debug('已取消语言更新订阅');

        // 销毁TabComponent
        if (this.tabComponent && 'destroy' in this.tabComponent) {
            (this.tabComponent as unknown as LanguageUpdateable).destroy();
            configUILogger.debug('已销毁标签页组件');
        }

        // 移除配置窗口
        const modalWindow = document.getElementById("jsrei-js-script-hook-configuration-modal-window");
        if (modalWindow) {
            // 销毁时确实要从DOM中移除，而不仅仅是隐藏
            modalWindow.remove();
            configUILogger.debug('已移除配置窗口');
        }

        // 移除根容器
        const rootElement = document.getElementById('js-script-hook-modal-root');
        if (rootElement) {
            rootElement.remove();
            configUILogger.debug('已移除根容器');
        }

        // 移除样式
        const style = document.getElementById("configuration-component-style");
        if (style) {
            style.remove();
            configUILogger.debug('已移除样式');
        }
        
        configUILogger.debug('配置组件销毁完成');
    }
} 