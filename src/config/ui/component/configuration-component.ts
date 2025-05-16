import $ from 'jquery';
import { GlobalOptionsComponent } from "./global-options-component";
import { DebuggerManagerComponent } from "./debugger-manager-component";
import { getGlobalConfig } from "../../config";
import { getLanguage } from "./language";

/**
 * 配置组件
 */
export class ConfigurationComponent {
    private readonly modalHTML: string;

    constructor() {
        this.modalHTML = `
        <div id="jsrei-js-script-hook-configuration-modal-window" style="display:none !important; position:fixed !important; left:0 !important; top:0 !important; width:100% !important; height:100% !important; background-color:rgba(0,0,0,0.85) !important; z-index:2147483646 !important; overflow-y:auto !important;">
            <div class="js-script-hook-scrollable-div" style="display: flex; width: 930px !important; text-align: center !important; padding: 30px !important; margin: 10px !important; position:absolute !important; left:50% !important; top:50% !important; transform:translate(-50%, -50%) !important; background:white !important; border-radius:5px !important; box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important; max-width:80% !important; text-align:center !important; z-index:99999999999; !important">
                <button id="jsrei-js-script-hook-configuration-close-btn" style="position:absolute; right:8px; top:8px; cursor:pointer; padding:3px 6px; border:none; background-color:#f44336; color:white; border-radius:50%; font-size:10px;">×</button>
                <div id="js-script-hook-configuration-content" style="color: black;"></div>
            </div>
        </div>
    `;
    }

    /**
     * 展示配置界面
     */
    public show(): void {
        // i18n配置语言
        const language = getLanguage(getGlobalConfig().language);

        // 将模态框添加到body元素中
        $(document.body).append($(this.modalHTML));

        // 全局配置参数
        const globalOptionsComponent = new GlobalOptionsComponent();
        $("#js-script-hook-configuration-content").append(globalOptionsComponent.render(language, getGlobalConfig()));

        // 断点参数
        const debuggerManager = new DebuggerManagerComponent();
        $("#js-script-hook-configuration-content").append(debuggerManager.render(language, getGlobalConfig().debuggers));

        // 关闭按钮事件处理
        document.getElementById("jsrei-js-script-hook-configuration-close-btn")?.addEventListener('click', this.closeModalWindow);
        const modalWindow = document.getElementById("jsrei-js-script-hook-configuration-modal-window");
        if (modalWindow) {
            modalWindow.style.display = 'flex';
        }
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