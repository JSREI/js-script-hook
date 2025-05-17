import { Language } from "../language";
import { DebuggerComponent } from "../debugger";
import { Debugger } from "../../../../debugger/debugger";
import { getGlobalConfig } from "../../../config";
import { LanguageUpdateable, LanguageEventManager } from '../language-event';
import { createLogger } from '../../../../logger';
import { debuggerManagerStyles } from './styles';
import { createDebuggerManagerTemplate } from './template';
import { bindDebuggerManagerEvents } from './events';

const debuggerManagerLogger = createLogger('debugger-manager-component');

/**
 * 断点管理器组件
 */
export class DebuggerManagerComponent implements LanguageUpdateable {
    private readonly componentId: string;
    private currentLanguage: Language | undefined;
    private debuggerComponents: DebuggerComponent[] = [];
    private managerElement: HTMLElement | null = null;

    constructor() {
        this.componentId = 'debugger-manager-component-' + Math.random().toString(36).substring(2, 10);
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
        style.appendChild(document.createTextNode(debuggerManagerStyles));
        
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
        tempContainer.innerHTML = createDebuggerManagerTemplate(language);
        this.managerElement = tempContainer.firstElementChild as HTMLElement;

        // 渲染已经存在的断点配置信息
        const debuggerList = this.managerElement.querySelector("#js-script-hook-debugger-list");
        if (debuggerList) {
            this.debuggerComponents = [];
            for (const debuggerInformation of debuggers) {
                const debuggerComponent = new DebuggerComponent();
                this.debuggerComponents.push(debuggerComponent);
                // 需要进行类型转换，因为DebuggerComponent.render的参数与Debugger类型不完全匹配
                debuggerList.appendChild(debuggerComponent.render(language, debuggerInformation as any));
            }
        }

        // 绑定事件处理
        bindDebuggerManagerEvents(this.managerElement, language, this.debuggerComponents);

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
                addButtonText.textContent = language.tabs.addNewBreakpoint;
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
} 