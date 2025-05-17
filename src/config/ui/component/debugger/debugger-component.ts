import { getGlobalConfig } from "../../../config";
import { DebuggerConfig } from './types';
import { Language } from '../language';
import { LanguageUpdateable } from '../language-event';
import { LanguageEventManager } from '../language-event';
import { createLogger } from '../../../../logger';
import { debuggerStyles } from './styles';
import { createDebuggerTemplate } from './template';
import { bindDebuggerEvents } from './events';
import { updateDebuggerLanguage } from './language-update';
import { 
    SelectComponent, 
    InputComponent,
    CheckboxComponent,
    ButtonComponent,
    TextareaComponent,
    TipsComponent
} from '../basic';

// 创建DebuggerComponent专用的日志记录器
const debuggerCompLogger = createLogger('debugger-component');

/**
 * 用于表示一个断点配置
 */
export class DebuggerComponent implements LanguageUpdateable {
    private selectComponent: SelectComponent;
    private inputComponent: InputComponent;
    private checkboxComponent: CheckboxComponent;
    private buttonComponent: ButtonComponent;
    private textareaComponent: TextareaComponent;
    private tipsComponent: TipsComponent;
    private readonly componentId: string;
    private currentLanguage: Language | undefined;
    private currentConfig: DebuggerConfig | undefined;
    private componentElement: HTMLElement | null = null;
    private tipsInstances: { [key: string]: TipsComponent } = {}; // 存储tips实例的映射表
    
    constructor() {
        this.componentId = 'debugger-component';
        
        // 初始化子组件
        this.selectComponent = new SelectComponent();
        this.inputComponent = new InputComponent();
        this.checkboxComponent = new CheckboxComponent();
        this.buttonComponent = new ButtonComponent();
        this.textareaComponent = new TextareaComponent(
            'placeholder-id',
            'Placeholder',
            'Placeholder text',
            '',
            () => {}
        );
        this.tipsComponent = new TipsComponent();
        
        this.appendStyles();
        
        // 订阅语言更新事件
        LanguageEventManager.getInstance().subscribe(this.componentId, this.updateLanguage.bind(this));
    }
    
    /**
     * 添加组件样式到页面中
     */
    private appendStyles(): void {
        // 避免重复插入
        if (document.getElementById("debugger-component-style")) {
            return;
        }

        // 创建一个 <style> 元素
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "debugger-component-style";
        
        // 将 CSS 规则添加到 <style> 元素
        style.appendChild(document.createTextNode(debuggerStyles));
        
        // 将 <style> 元素插入到 <head> 中
        document.head.appendChild(style);
    }

    /**
     * 渲染断点组件
     * @param language 语言配置
     * @param debuggerInformation 断点信息
     * @returns HTMLElement
     */
    public render(language: Language, debuggerInformation: DebuggerConfig): HTMLElement {
        this.currentLanguage = language;
        this.currentConfig = debuggerInformation;
        
        // 添加组件样式
        this.appendStyles();

        // 创建临时容器
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = createDebuggerTemplate(language, debuggerInformation);
        this.componentElement = tempContainer.firstElementChild as HTMLElement;
        
        // 渲染所有的tips组件
        if (this.componentElement) {
            this.renderTipsComponents(language, debuggerInformation.id);
        }

        // 绑定事件处理
        bindDebuggerEvents(
            this.componentElement, 
            language, 
            debuggerInformation, 
            {
                selectComponent: this.selectComponent,
                inputComponent: this.inputComponent,
                checkboxComponent: this.checkboxComponent,
                buttonComponent: this.buttonComponent,
                textareaComponent: this.textareaComponent
            },
            this.destroy.bind(this)
        );

        return this.componentElement;
    }
    
    /**
     * 渲染所有tips组件
     * @param language 语言配置
     * @param debuggerId 断点ID
     */
    private renderTipsComponents(language: Language, debuggerId: string): void {
        if (!this.componentElement) return;
        
        // 为每个提示容器渲染TipsComponent
        const tipsConfig = [
            { containerId: `${debuggerId}-enable-tip-container`, tipText: language.debugger_config.enableTips },
            { containerId: `${debuggerId}-url-pattern-tip-container`, tipText: language.debugger_config.urlPatternTips },
            { containerId: `${debuggerId}-url-pattern-text-tip-container`, tipText: language.debugger_config.urlPatternTextTips },
            { containerId: `${debuggerId}-url-pattern-test-tip-container`, tipText: language.debugger_config.urlPatternTestTips },
            { containerId: `${debuggerId}-enable-request-debugger-tip-container`, tipText: language.debugger_config.enableRequestDebuggerTips },
            { containerId: `${debuggerId}-enable-response-debugger-tip-container`, tipText: language.debugger_config.enableResponseDebuggerTips },
            { containerId: `${debuggerId}-callback-function-param-name-tip-container`, tipText: language.debugger_config.callbackFunctionParamNameTips },
            { containerId: `${debuggerId}-comment-tip-container`, tipText: language.debugger_config.commentTips }
        ];
        
        // 清理旧的tips实例
        for (const key in this.tipsInstances) {
            if (this.tipsInstances[key]) {
                this.tipsInstances[key].destroy();
            }
        }
        this.tipsInstances = {};
        
        for (const config of tipsConfig) {
            const container = this.componentElement.querySelector(`#${config.containerId}`);
            if (container) {
                // 先清空容器内容
                container.innerHTML = '';
                
                // 创建新的TipsComponent实例
                const tipComponent = new TipsComponent();
                const tipElement = tipComponent.render(config.tipText);
                
                // 保存tips实例以便后续管理
                this.tipsInstances[config.containerId] = tipComponent;
                
                // 将tip元素添加到容器中
                container.appendChild(tipElement);
            }
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
        if (!this.componentElement || !this.currentConfig) {
            return;
        }

        // 更新语言时重新渲染所有tips组件
        this.renderTipsComponents(language, this.currentConfig.id);

        updateDebuggerLanguage(
            this.componentElement,
            language,
            this.currentConfig,
            this.selectComponent,
            this.inputComponent,
            this.checkboxComponent,
            this.buttonComponent,
            this.textareaComponent,
            this.tipsComponent
        );
    }

    /**
     * 组件销毁时取消订阅并清理资源
     */
    public destroy(): void {
        try {
            // 取消语言更新订阅
            LanguageEventManager.getInstance().unsubscribe(this.componentId);
            
            // 销毁子组件
            if (this.selectComponent) {
                this.selectComponent.destroy();
            }
            if (this.inputComponent) {
                this.inputComponent.destroy();
            }
            if (this.checkboxComponent) {
                this.checkboxComponent.destroy();
            }
            if (this.buttonComponent) {
                this.buttonComponent.destroy();
            }
            if (this.textareaComponent) {
                this.textareaComponent.destroy();
            }
            if (this.tipsComponent) {
                this.tipsComponent.destroy();
            }
            
            // 销毁所有tips实例
            for (const key in this.tipsInstances) {
                if (this.tipsInstances[key]) {
                    this.tipsInstances[key].destroy();
                }
            }
            this.tipsInstances = {};

            // 移除DOM元素
            if (this.componentElement) {
                this.componentElement.remove();
                this.componentElement = null;
            }

            // 清理引用
            this.currentConfig = undefined;
            this.currentLanguage = undefined;
        } catch (error) {
            debuggerCompLogger.error(`销毁调试器组件时出错: ${error}`);
        }
    }
} 