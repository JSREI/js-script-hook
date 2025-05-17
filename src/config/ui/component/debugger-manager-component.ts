import { DebuggerComponent, Language, DebuggerConfig } from "./debugger-component";
import { Debugger } from "../../../debugger/debugger";
import { getGlobalConfig } from "../../config";
import { LanguageUpdateable } from './language-updateable';
import { LanguageEventManager } from './language-event-manager';
import { createLogger } from '../../../logger';

const debuggerManagerLogger = createLogger('debugger-manager-component');

/**
 * 断点管理器组件
 */
export class DebuggerManagerComponent implements LanguageUpdateable {
    private readonly html: string;
    private readonly styleCSS: string;
    private readonly componentId: string;
    private currentLanguage: Language | undefined;
    private debuggerComponents: DebuggerComponent[] = [];
    private managerElement: HTMLElement | null = null;

    constructor() {
        this.componentId = 'debugger-manager-component-' + Math.random().toString(36).substring(2, 10);
        this.styleCSS = `
        /* 添加断点按钮样式 */
        #js-script-hook-add-debugger-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 780px;
            height: 80px;
            margin: 15px 0;
            border: 2px dashed #ddd;
            border-radius: 8px;
            background-color: #f9f9f9;
            color: #666;
            font-size: 18px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        #js-script-hook-add-debugger-btn:hover {
            border-color: #66bb6a;
            background-color: #f0f7f0;
            color: #43a047;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        
        #js-script-hook-add-debugger-btn .plus-icon {
            font-size: 24px;
            margin-right: 10px;
            font-weight: 300;
        }

        /* 断点列表容器 */
        #js-script-hook-debugger-list {
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        /* 圆形序号样式 */
        .js-script-hook-circle-number {
            display: inline-block;
            width: 24px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            border-radius: 50%;
            background-color: #eee;
            color: #666;
            margin-right: 10px;
            font-weight: bold;
        }
        
        #js-script-hook-add-debugger {
            display: flex;
            justify-content: center;
        }
        `;

        this.html = `
<div>
    <div id="js-script-hook-debugger-list"></div>
    <div id="js-script-hook-add-debugger">
        <button id="js-script-hook-add-debugger-btn">
            <span class="plus-icon">+</span>
            <span>添加新的断点</span>
        </button>
    </div>
</div>
        `;

        this.appendStyles();
        
        // 订阅语言更新事件
        LanguageEventManager.getInstance().subscribe(this.componentId, this.updateLanguage.bind(this));
    }

    /**
     * 添加组件样式到页面中
     */
    private appendStyles(): void {
        // 避免重复插入
        if (document.getElementById("debugger-manager-component-style")) {
            return;
        }

        // 创建一个 <style> 元素
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "debugger-manager-component-style";
        
        // 将 CSS 规则添加到 <style> 元素
        style.appendChild(document.createTextNode(this.styleCSS));
        
        // 将 <style> 元素插入到 <head> 中
        document.head.appendChild(style);
    }

    /**
     * 渲染断点管理器组件
     * @param language 语言配置
     * @param debuggers 断点配置数组
     * @returns HTMLElement
     */
    render(language: Language, debuggers: Debugger[]): HTMLElement {
        this.currentLanguage = language;
        
        // 添加组件样式
        this.appendStyles();

        // 按照最后修改时间排序
        debuggers.sort((a, b) => {
            const t1 = parseInt(String(a.updateTime || 0));
            const t2 = parseInt(String(b.updateTime || 0));
            return t2 - t1;
        });

        // 创建临时容器
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = this.html;
        this.managerElement = tempContainer.firstElementChild as HTMLElement;
        
        // 更新添加按钮的文本
        const addButtonText = this.managerElement.querySelector("#js-script-hook-add-debugger-btn span:last-child");
        if (addButtonText) {
            addButtonText.textContent = language.tabs.addNewBreakpoint || "添加新的断点";
        }

        // 渲染已经存在的断点配置信息
        const debuggerList = this.managerElement.querySelector("#js-script-hook-debugger-list");
        if (debuggerList) {
            this.debuggerComponents = [];
            for (const debuggerInformation of debuggers) {
                const debuggerComponent = new DebuggerComponent();
                this.debuggerComponents.push(debuggerComponent);
                debuggerList.appendChild(debuggerComponent.render(language, debuggerInformation as unknown as DebuggerConfig));
            }
        }

        // 增加断点配置
        const addButton = this.managerElement.querySelector("#js-script-hook-add-debugger-btn");
        if (addButton) {
            addButton.addEventListener('click', () => {
                const debuggerComponent = new DebuggerComponent();
                const newDebuggerConfig = this.createNewDebuggerConfig();
                const debuggerList = this.managerElement?.querySelector("#js-script-hook-debugger-list");
                if (debuggerList) {
                    this.debuggerComponents.push(debuggerComponent);
                    debuggerList.appendChild(debuggerComponent.render(this.currentLanguage!, newDebuggerConfig as unknown as DebuggerConfig));
                }

                getGlobalConfig().addDebugger(newDebuggerConfig);
                getGlobalConfig().persist();
            });
        }

        return this.managerElement;
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
        if (!this.managerElement) {
            return;
        }

        try {
            this.currentLanguage = language;
            
            // 更新添加按钮的文本
            const addButtonText = this.managerElement.querySelector("#js-script-hook-add-debugger-btn span:last-child");
            if (addButtonText) {
                addButtonText.textContent = language.tabs.addNewBreakpoint || "添加新的断点";
            }

            // 更新所有断点组件的语言
            for (const debuggerComponent of this.debuggerComponents) {
                if (debuggerComponent instanceof DebuggerComponent && 'updateLanguage' in debuggerComponent) {
                    (debuggerComponent as unknown as LanguageUpdateable).updateLanguage(language);
                }
            }
        } catch (error) {
            debuggerManagerLogger.error(`更新断点管理器语言时出错: ${error}`);
        }
    }

    /**
     * 组件销毁时取消订阅
     */
    public destroy(): void {
        LanguageEventManager.getInstance().unsubscribe(this.componentId);
        
        // 销毁所有断点组件
        for (const debuggerComponent of this.debuggerComponents) {
            if (debuggerComponent instanceof DebuggerComponent && 'destroy' in debuggerComponent) {
                (debuggerComponent as unknown as LanguageUpdateable).destroy();
            }
        }
        this.debuggerComponents = [];
    }

    private createNewDebuggerConfig(): Debugger {
        const newDebuggerConfig = new Debugger();
        newDebuggerConfig.id = `debugger-${new Date().getTime()}`;
        newDebuggerConfig.enable = true;
        newDebuggerConfig.urlPattern = "";
        newDebuggerConfig.urlPatternType = "match-all";
        newDebuggerConfig.enableRequestDebugger = true;
        newDebuggerConfig.enableResponseDebugger = true;
        newDebuggerConfig.callbackFunctionName = "";
        newDebuggerConfig.comment = "";
        return newDebuggerConfig;
    }
} 