import $ from 'jquery';
import { DebuggerComponent, Language, DebuggerConfig } from "./debugger-component";
import { Debugger } from "../../../debugger/debugger";
import { randomId } from "../../../utils/id-util";
import { getGlobalConfig } from "../../config";

/**
 * 断点管理器组件
 */
export class DebuggerManagerComponent {
    private readonly html: string;
    private readonly styleCSS: string;

    constructor() {
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
     * @returns jQuery对象
     */
    render(language: Language, debuggers: Debugger[]): JQuery<HTMLElement> {
        // 添加组件样式
        this.appendStyles();

        // 按照最后修改时间排序
        debuggers.sort((a, b) => {
            const t1 = parseInt(String(a.updateTime || 0));
            const t2 = parseInt(String(b.updateTime || 0));
            return t2 - t1;
        });

        const debuggerManager = $(this.html);
        
        // 更新添加按钮的文本
        debuggerManager.find("#js-script-hook-add-debugger-btn span:last").text(language.tabs.addNewBreakpoint || "添加新的断点");

        // 渲染已经存在的断点配置信息
        for (const debuggerInformation of debuggers) {
            const debuggerComponent = new DebuggerComponent();
            debuggerManager.find("#js-script-hook-debugger-list").append(debuggerComponent.render(language, debuggerInformation as unknown as DebuggerConfig));
        }

        // 增加断点配置
        debuggerManager.find("#js-script-hook-add-debugger-btn").click(() => {
            const debuggerComponent = new DebuggerComponent();
            const newDebuggerConfig = this.createNewDebuggerConfig();
            debuggerManager.find("#js-script-hook-debugger-list").append(debuggerComponent.render(language, newDebuggerConfig as unknown as DebuggerConfig));

            getGlobalConfig().addDebugger(newDebuggerConfig);
            getGlobalConfig().persist();
        });

        return debuggerManager;
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