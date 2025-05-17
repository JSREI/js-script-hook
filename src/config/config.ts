import { DebuggerTester } from "../debugger/debugger-tester";
import { Debugger, UrlPatternType } from "../debugger/debugger";
import { ScriptContext } from "../context/script/script-context";
import { createLogger } from "../logger";
import { loadValue, saveValue } from "../storage";
import { LanguageEventManager } from "./ui/component/language-event";
import { getLanguage } from "./ui/component/language";

// 创建配置模块专用的日志记录器
const configLogger = createLogger('config');

// 保留原始声明用于兼容性，但实际使用我们自己的存储工具
declare const GM_getValue: (key: string) => string | undefined;
declare const GM_setValue: (key: string, value: string) => void;

const GM_config_name = "js-script-hook-config-name";

export type HookType = "use-proxy-function" | "use-redeclare-function";
export type Language = "english" | "chinese";

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
    private lastSavedConfig: string;

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
        // 保存初始配置的快照
        this.lastSavedConfig = JSON.stringify(this.toJSON());
    }

    /**
     * 将配置转换为纯对象
     */
    public toJSON(): object {
        return {
            language: this.language,
            prefix: this.prefix,
            hookType: this.hookType,
            isIgnoreJsSuffixRequest: this.isIgnoreJsSuffixRequest,
            isIgnoreNotJsonpRequest: this.isIgnoreNotJsonpRequest,
            debuggers: this.debuggers.map(dbg => ({
                id: dbg.id,
                enable: dbg.enable,
                urlPattern: dbg.urlPattern,
                urlPatternType: dbg.urlPatternType,
                enableRequestDebugger: dbg.enableRequestDebugger,
                enableResponseDebugger: dbg.enableResponseDebugger,
                callbackFunctionName: dbg.callbackFunctionName,
                comment: dbg.comment,
                createTime: dbg.createTime,
                updateTime: dbg.updateTime
            }))
        };
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
            configLogger.info('正在加载配置...');
            // 使用新的存储工具，已自动处理JSON解析
            const configJson = loadValue(GM_config_name);
            configLogger.debug(`从存储加载的配置: ${JSON.stringify(configJson)}`);
            
            if (!configJson) {
                configLogger.info('没有找到存储的配置，使用默认配置');
                return this;
            }
            
            // configJson已经是解析后的对象，无需再次调用JSON.parse
            const o = configJson;
            const oldLanguage = this.language;
            
            // 确保加载的配置有效
            if (o.language && (o.language === 'english' || o.language === 'chinese')) {
                this.language = o.language;
            }
            
            if (typeof o.prefix === 'string') {
                this.prefix = o.prefix;
            }
            
            if (o.hookType && (o.hookType === 'use-proxy-function' || o.hookType === 'use-redeclare-function')) {
                this.hookType = o.hookType;
            }
            
            if (typeof o.isIgnoreJsSuffixRequest === 'boolean') {
                this.isIgnoreJsSuffixRequest = o.isIgnoreJsSuffixRequest;
            }
            
            if (typeof o.isIgnoreNotJsonpRequest === 'boolean') {
                this.isIgnoreNotJsonpRequest = o.isIgnoreNotJsonpRequest;
            }
            
            // 处理断点数组
            if (Array.isArray(o.debuggers)) {
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
            }

            // 更新配置快照
            this.lastSavedConfig = JSON.stringify(this.toJSON());
            
            // 如果语言发生变化，触发语言更新事件
            if (oldLanguage !== this.language) {
                const newLanguage = getLanguage(this.language);
                LanguageEventManager.getInstance().notifyLanguageUpdate(newLanguage);
            }

            configLogger.info(`配置加载完成，当前语言: ${this.language}`);
            return this;
        } catch (error) {
            configLogger.error(`加载配置时出错: ${error}`);
            return this;
        }
    }

    public persist(): boolean {
        try {
            configLogger.info('正在保存配置...');
            configLogger.debug(`当前语言设置: ${this.language}`);
            
            // 获取当前配置的JSON表示
            const currentConfig = this.toJSON();
            const currentConfigStr = JSON.stringify(currentConfig);
            
            // 如果配置没有变化，不需要保存
            if (currentConfigStr === this.lastSavedConfig) {
                configLogger.debug('配置未发生变化，无需保存');
                return true;
            }
            
            // 保存配置
            saveValue(GM_config_name, currentConfig);
            
            // 验证设置是否成功
            const savedConfig = loadValue(GM_config_name);
            const savedConfigStr = JSON.stringify(savedConfig);
            configLogger.debug(`验证保存结果: ${savedConfigStr}`);
            
            if (savedConfigStr === currentConfigStr) {
                configLogger.debug('配置保存验证成功');
                this.lastSavedConfig = currentConfigStr;
                return true;
            } else {
                configLogger.error('配置保存验证失败！');
                return false;
            }
        } catch (error) {
            configLogger.error(`保存配置时出错: ${error}`);
            return false;
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
    configLogger.info('初始化配置开始');
    const configBefore = JSON.stringify(globalConfig.toJSON());
    configLogger.debug(`初始化前配置: ${configBefore}`);
    
    globalConfig.load();
    
    const configAfter = JSON.stringify(globalConfig.toJSON());
    configLogger.debug(`初始化后配置: ${configAfter}`);
    configLogger.debug(`配置是否改变: ${configBefore !== configAfter}`);
    configLogger.debug(`当前语言设置: ${globalConfig.language}`);
}

export function getGlobalConfig(): Config {
    return globalConfig;
} 