import { DebuggerTester } from "../debugger/debugger-tester";
import { Debugger, UrlPatternType } from "../debugger/debugger";
import { ScriptContext } from "../context/script/script-context";

declare const GM_getValue: (key: string) => string | undefined;
declare const GM_setValue: (key: string, value: string) => void;

const GM_config_name = "js-script-hook-config-name";

type HookType = "use-proxy-function" | "use-redeclare-function";
type Language = "english" | "chinese";

/**
 * 支持的相关配置
 */
export class Config {
    public language: Language;
    public prefix: string;
    public hookType: HookType;
    public isIgnoreJsSuffixRequest: boolean;
    public isIgnoreNotJsonpRequest: boolean;
    public debuggers: Debugger[];

    constructor() {
        // 默认为英文的操作界面
        this.language = "english";
        // 让用户能够自己指定前缀，也许会有一些拥有感？之前ast hook好像就有个哥们喜欢这样干...
        this.prefix = "JSREI";
        this.hookType = "use-proxy-function";
        // 是否忽略.js后缀的请求
        this.isIgnoreJsSuffixRequest = false;
        // 是否忽略不是jsonp的请求
        this.isIgnoreNotJsonpRequest = false;
        // 所有的断点
        this.debuggers = [];
    }

    public findDebuggerById(id: string): Debugger | null {
        for (const debuggerInformation of this.debuggers) {
            if (debuggerInformation.id === id) {
                return debuggerInformation;
            }
        }
        return null;
    }

    public addDebugger(debuggerInformation: Debugger): void {
        // TODO 2024-12-22 05:06:15 断点的有效性校验
        this.debuggers.push(debuggerInformation);
    }

    public removeDebuggerById(id: string): void {
        this.debuggers = this.debuggers.filter(debuggerInformation => debuggerInformation.id !== id);
    }

    public load(): Config {
        try {
            console.log('[DEBUG] 正在加载配置...');
            const configJsonString = GM_getValue(GM_config_name);
            console.log('[DEBUG] 从存储加载的配置字符串:', configJsonString);
            
            if (!configJsonString) {
                console.log('[DEBUG] 没有找到存储的配置，使用默认配置');
                return this;
            }
            
            const o = JSON.parse(configJsonString);
            console.log('[DEBUG] 解析后的配置对象:', o);
            
            this.language = o.language;
            this.prefix = o.prefix;
            this.hookType = o.hookType;
            this.isIgnoreJsSuffixRequest = o.isIgnoreJsSuffixRequest;
            this.isIgnoreNotJsonpRequest = o.isIgnoreNotJsonpRequest;
            this.debuggers = [];
            for (const debuggerInformationObject of o.debuggers) {
                const debuggerInformation = new Debugger();
                debuggerInformation.createTime = debuggerInformationObject.createTime;
                debuggerInformation.updateTime = debuggerInformationObject.updateTime;
                debuggerInformation.id = debuggerInformationObject.id;
                debuggerInformation.enable = debuggerInformationObject.enable;
                debuggerInformation.urlPattern = debuggerInformationObject.urlPattern;
                debuggerInformation.urlPatternType = debuggerInformationObject.urlPatternType;
                debuggerInformation.enableRequestDebugger = debuggerInformationObject.enableRequestDebugger;
                debuggerInformation.enableResponseDebugger = debuggerInformationObject.enableResponseDebugger;
                debuggerInformation.callbackFunctionName = debuggerInformationObject.callbackFunctionName;
                debuggerInformation.comment = debuggerInformationObject.comment;
                this.debuggers.push(debuggerInformation);
            }
            console.log('[DEBUG] 配置加载完成，当前语言:', this.language);
            return this;
        } catch (error) {
            console.error('[ERROR] 加载配置时出错:', error);
            return this;
        }
    }

    public persist(): void {
        try {
            console.log('[DEBUG] 正在保存配置...');
            const configJsonString = JSON.stringify(this);
            console.log('[DEBUG] 要保存的配置JSON:', configJsonString);
            console.log('[DEBUG] 当前语言设置:', this.language);
            
            // 检查GM_setValue是否可用
            if (typeof GM_setValue !== 'function') {
                console.error('[ERROR] GM_setValue 不是一个函数！', typeof GM_setValue);
                return;
            }
            
            GM_setValue(GM_config_name, configJsonString);
            
            // 验证设置是否成功
            const savedValue = GM_getValue(GM_config_name);
            console.log('[DEBUG] 验证保存后的值:', savedValue);
            console.log('[DEBUG] 保存成功？', savedValue === configJsonString);
        } catch (error) {
            console.error('[ERROR] 保存配置时出错:', error);
        }
    }

    /**
     * 执行测试所有断点，看看是否有条件命中啥的
     * @param scriptContext - 脚本上下文
     * @returns {Array<Debugger>} - 命中的断点列表
     */
    public testAll(scriptContext: ScriptContext): Debugger[] {
        const hitDebuggers: Debugger[] = [];
        for (const jsonpDebugger of this.debuggers) {
            if (jsonpDebugger.enable && new DebuggerTester().test(this, jsonpDebugger, scriptContext)) {
                hitDebuggers.push(jsonpDebugger);
            }
        }
        return hitDebuggers;
    }

    /**
     * 测试是否能够命中响应内容
     * @param scriptContext - 脚本上下文
     * @returns {Array<Debugger>} - 命中的断点列表
     */
    public testAllForResponse(scriptContext: ScriptContext): Debugger[] {
        const hitDebuggers: Debugger[] = [];
        for (const debuggerConfig of this.debuggers) {
            if (debuggerConfig.enable && new DebuggerTester().testForResponse(this, debuggerConfig, scriptContext)) {
                hitDebuggers.push(debuggerConfig);
            }
        }
        return hitDebuggers;
    }
}

let globalConfig = new Config();

export function initConfig(): void {
    console.log('[DEBUG] 初始化配置开始');
    const configBefore = JSON.stringify(globalConfig);
    console.log('[DEBUG] 初始化前配置:', configBefore);
    
    globalConfig.load();
    
    const configAfter = JSON.stringify(globalConfig);
    console.log('[DEBUG] 初始化后配置:', configAfter);
    console.log('[DEBUG] 配置是否改变:', configBefore !== configAfter);
    console.log('[DEBUG] 当前语言设置:', globalConfig.language);
}

export function getGlobalConfig(): Config {
    return globalConfig;
} 