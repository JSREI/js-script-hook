const {DebuggerTester} = require("../debugger/debugger-tester");
const {Debugger} = require("../debugger/debugger");
const GM_config_name = "js-script-hook-config-name";

/**
 * 支持的相关配置
 */
class Config {

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

        // 在打开配置页面的时候自动跳转到项目主页
        this.autoJumpProjectSiteOnConfiguraion = true;

        // 所有的断点
        this.debuggers = [];
    }

    findDebuggerById(id) {
        for (let debuggerInformation of this.debuggers) {
            if (debuggerInformation.id === id) {
                return debuggerInformation;
            }
        }
        return null;
    }

    addDebugger(debuggerInformation) {
        // TODO 2024-12-22 05:06:15 断点的有效性校验
        this.debuggers.push(debuggerInformation);
    }

    removeDebuggerById(id) {
        const newDebuggers = [];
        for (let debuggerInformation of this.debuggers) {
            if (debuggerInformation.id !== id) {
                newDebuggers.push(debuggerInformation);
            }
        }
        this.debuggers = newDebuggers;
    }

    load() {
        const configJsonString = GM_getValue(GM_config_name);
        if (!configJsonString) {
            return this;
        }
        const o = JSON.parse(configJsonString);
        this.language = o.language;
        this.prefix = o.prefix;
        this.hookType = o.hookType;
        this.isIgnoreJsSuffixRequest = o.isIgnoreJsSuffixRequest;
        this.isIgnoreNotJsonpRequest = o.isIgnoreNotJsonpRequest;
        this.autoJumpProjectSiteOnConfiguraion = o.autoJumpProjectSiteOnConfiguraion;
        this.debuggers = [];
        for (let debuggerInformationObject of o.debuggers) {
            const debuggerInformation = new Debugger();
            debuggerInformation.createTime = debuggerInformationObject.createTime;
            debuggerInformation.updateTime = debuggerInformationObject.updateTime;
            debuggerInformation.id = debuggerInformationObject.id;
            debuggerInformation.enable = debuggerInformationObject.enable;
            debuggerInformation.urlPattern = debuggerInformationObject.urlPattern;
            debuggerInformation.urlPatternType = debuggerInformationObject.urlPatternType;
            debuggerInformation.enableRequestDebugger = debuggerInformationObject.enableRequestDebugger;
            debuggerInformation.enableResponseDebugger = debuggerInformationObject.enableResponseDebugger;
            debuggerInformation.callbackFunctionParamName = debuggerInformationObject.callbackFunctionParamName;
            debuggerInformation.comment = debuggerInformationObject.comment;
            this.debuggers.push(debuggerInformation);
        }
        return this;
    }

    persist() {
        const configJsonString = JSON.stringify(this);
        GM_setValue(GM_config_name, configJsonString);
    }

    /**
     * 执行测试所有断点，看看是否有条件命中啥的
     *
     * @param scriptContext {ScriptContext}
     * @return {Array<Debugger>}
     */
    testAll(scriptContext) {
        const hitDebuggers = [];
        for (let jsonpDebugger of this.debuggers) {
            if (jsonpDebugger.enable && new DebuggerTester().test(this, jsonpDebugger, scriptContext)) {
                hitDebuggers.push(jsonpDebugger);
            }
        }
        return hitDebuggers;
    }

    /**
     * 测试是否能够命中响应内容
     *
     * @param scriptContext
     * @return {*[]}
     */
    testAllForResponse(scriptContext) {
        const hitDebuggers = [];
        for (let debuggerConfig of this.debuggers) {
            if (debuggerConfig.enable && new DebuggerTester().testForResponse(this, debuggerConfig, scriptContext)) {
                hitDebuggers.push(debuggerConfig);
            }
        }
        return hitDebuggers;
    }

}

let globalConfig = new Config();

function initConfig() {
    globalConfig.load();
}

function getGlobalConfig() {
    return globalConfig;
}

module.exports = {
    Config,
    initConfig,
    getGlobalConfig
}
