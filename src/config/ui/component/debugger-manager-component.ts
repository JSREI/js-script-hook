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

    constructor() {
        this.html = `
<div>
    <div id="js-script-hook-debugger-list"></div>
    <div id="js-script-hook-add-debugger">
        <button id="js-script-hook-add-debugger-btn" style="font-size: 100px !important; border: 1px solid black !important; display: inline-block !important; width: 800px !important; padding: 10px !important; margin: 10px !important; height: 200px !important; cursor:pointer !important;">+</button>
    </div>
</div>
        `;
    }

    /**
     * 渲染断点管理器组件
     * @param language 语言配置
     * @param debuggers 断点配置数组
     * @returns jQuery对象
     */
    render(language: Language, debuggers: Debugger[]): JQuery<HTMLElement> {
        // 按照最后修改时间排序
        debuggers.sort((a, b) => {
            const t1 = parseInt(String(a.updateTime || 0));
            const t2 = parseInt(String(b.updateTime || 0));
            return t2 - t1;
        });

        const debuggerManager = $(this.html);

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