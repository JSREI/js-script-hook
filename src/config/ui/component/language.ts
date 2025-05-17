import { getGlobalConfig } from "../../config";

interface ConsoleLanguage {
    tableKey: string;
    tableValue: string;
    tableComment: string;
    titleRequest: string;
    titleResponse: string;
    time: string;
    requestId: string;
    isJsonpRequest: string;
    hostname: string;
    path: string;
    param: string;
    hash: string;
    paramName: string;
    paramValue: string;
    isJsonpCallback: string;
    codeLocation: string;
}

interface DebuggerConfigLanguage {
    debuggerTitle: string;
    enable: string;
    enableTips: string;
    urlPattern: string;
    urlPatternTips: string;
    urlPatternTypeTips: string;
    urlPatternType_EqualsThisString: string;
    urlPatternType_ContainsThisString: string;
    urlPatternType_MatchThisRegexp: string;
    urlPatternType_MatchALL: string;
    urlPatternTextTips: string;
    urlPatternTextPlaceholder: string;
    urlPatternTest: string;
    urlPatternTestTips: string;
    urlPatternTestPrompt: string;
    urlPatternTestResult: string;
    enableRequestDebugger: string;
    enableRequestDebuggerTips: string;
    enableResponseDebugger: string;
    enableResponseDebuggerTips: string;
    callbackFunctionParamName: string;
    callbackFunctionParamNameTips: string;
    callbackFunctionParamNamePlaceholder: string;
    comment: string;
    commentTips: string;
    commentPlaceholder: string;
}

interface GlobalSettingsLanguage {
    title: string;
    language: string;
    languageTips: string;
    flagPrefix: string;
    flagPrefixTips: string;
    flagPrefixPlaceholder: string;
    responseDebuggerHookType: string;
    responseDebuggerHookTypeTips: string;
    responseDebuggerHookTypeUseProxyFunction: string;
    responseDebuggerHookTypeUseRedeclareFunction: string;
    isIgnoreJsSuffixRequest: string;
    isIgnoreJsSuffixRequestTips: string;
    isIgnoreNotJsonpRequest: string;
    isIgnoreNotJsonpRequestTips: string;
}

interface TabsLanguage {
    debuggerListTab: string;
    globalSettingsTab: string;
    addNewBreakpoint: string;
}

// 新增确认对话框相关的语言配置
interface ConfirmDialogLanguage {
    deleteBreakpoint: string;
    deleteConfirmMessage: string;
    okButton: string;
    cancelButton: string;
}

export interface Language {
    global_settings: GlobalSettingsLanguage;
    debugger_config: DebuggerConfigLanguage;
    console: ConsoleLanguage;
    tabs: TabsLanguage;
    confirm_dialog: ConfirmDialogLanguage;  // 新增
}

// 中文菜单
const chinese: Language = {
    global_settings: {
        title: "全局设置",
        language: "界面语言：",
        languageTips: "你可以修改此配置界面的语言，修改后下次进入生效！ <br/> You can modify the language of this configuration interface, and the changes will take effect the next time you enter!",
        flagPrefix: "Hook Flag前缀：",
        flagPrefixTips: "在Hook的时候会设置一些全局唯一的标志位，你可以个性化修改为自定义的前缀",
        flagPrefixPlaceholder: "可自定义全局前缀，未设置默认为 JSREI_js_script_hook",
        responseDebuggerHookType: "响应断点Hook方式：",
        responseDebuggerHookTypeTips: "当Hook jsonp的callback函数的时候，有两种方式实现Hook：<br/><br/>一种是替换掉callback方法的引用，相当于是一个代理函数，这种需要在命中断点后再点一下跟进去callback函数的实现，这种方式兼容性比较好，绝大多数网站都可以丝滑兼容；<br/><br/>还有一种方式是直接改写callback函数的函数体，相当于是对函数的代码实现进行编辑后重新声明，这样子可以直接把断点打在callback函数体中，但此种方式可能会有一些作用域的兼容性问题，如有遇到报错，请调整为代理方式实现Hook；<br/><br/>注意，此选项修改后刷新页面后生效",
        responseDebuggerHookTypeUseProxyFunction: "使用代理函数实现Hook",
        responseDebuggerHookTypeUseRedeclareFunction: "直接修改网站callback函数体（注意可能会有兼容性问题）",
        isIgnoreJsSuffixRequest: "是否忽略.js后缀的请求：",
        isIgnoreJsSuffixRequestTips: "大多数时候.js后缀的请求都是单纯的加载JavaScript资源文件，可以选择忽略掉这类请求，当勾选的时候，控制台上也不会再打印.js请求",
        isIgnoreNotJsonpRequest: "是否忽略不是jsonp的请求：",
        isIgnoreNotJsonpRequestTips: "如果只关注jsonp类型的请求，可以选择忽略掉其它请求，当勾选的时候，控制台上也不会再打印非jsonp请求"
    },
    debugger_config: {
        debuggerTitle: "断点配置",
        enable: "是否启用此断点：",
        enableTips: "是否启用此断点，仅当断点处于启用状态的时候才会生效，取消勾选可以暂时禁用断点而无需删除。",
        urlPattern: "URL匹配方式：",
        urlPatternTips: "URL匹配方式用于指定当Script的URL符合什么条件时命中此断点",
        urlPatternTypeTips: "指定以什么方式匹配Script URL：",
        urlPatternType_EqualsThisString: "Script URL需要完全匹配给定的字符串",
        urlPatternType_ContainsThisString: "Script URL包含给定的字符串",
        urlPatternType_MatchThisRegexp: "Script URL匹配给定的正则表达式",
        urlPatternType_MatchALL: "直接匹配所有Script URL",
        urlPatternTextTips: "输入关键字或者表达式",
        urlPatternTextPlaceholder: "输入关键字或者表达式",
        urlPatternTest: "测试",
        urlPatternTestTips: "你可以输入一个script url测试此断点对其命中情况",
        urlPatternTestPrompt: "请输入要测试的URL：",
        urlPatternTestResult: "测试结果：",
        enableRequestDebugger: "是否开启请求断点：",
        enableRequestDebuggerTips: "启用请求断点后，在script请求发出之前进入断点",
        enableResponseDebugger: "是否开启响应断点：",
        enableResponseDebuggerTips: "启用响应断点之后，在jsonp请求的回调函数中命中断点",
        callbackFunctionParamName: "jsonp回调函数参数名称：",
        callbackFunctionParamNameTips: "不指定的话会使用内置引擎自动推测jsonp参数名称，推测失败的话可以手动指定",
        callbackFunctionParamNamePlaceholder: "不指定的话会使用内置引擎自动推测jsonp参数名称",
        comment: "备注：",
        commentTips: "你可以输入一些备注，或者相关信息的一些上下文，以防止时间长了之后忘记。",
        commentPlaceholder: "好记性不如烂笔头"
    },
    console: {
        tableKey: "键",
        tableValue: "值",
        tableComment: "备注",
        titleRequest: "Script Hook 捕捉到请求",
        titleResponse: "Script Hook 捕捉到响应",
        time: "时间",
        requestId: "请求ID",
        isJsonpRequest: "是否是jsonp请求",
        hostname: "请求域名",
        path: "请求路径",
        param: "请求参数",
        hash: "请求#hash",
        paramName: "参数名称",
        paramValue: "参数值",
        isJsonpCallback: "是否是jsonp回调函数",
        codeLocation: "代码位置"
    },
    tabs: {
        debuggerListTab: "断点列表",
        globalSettingsTab: "全局设置",
        addNewBreakpoint: "添加新的断点"
    },
    // 新增确认对话框的中文翻译
    confirm_dialog: {
        deleteBreakpoint: "删除断点",
        deleteConfirmMessage: "确定要删除此断点吗？删除后将无法恢复。",
        okButton: "删除",
        cancelButton: "取消"
    }
};

// 英文菜单
const english: Language = {
    global_settings: {
        title: "Global Settings",
        language: "Interface Language:",
        languageTips: "你可以修改此配置界面的语言，修改后下次进入生效！ <br/> You can modify the language of this configuration interface, and the changes will take effect the next time you enter!",
        flagPrefix: "Hook Flag Prefix:",
        flagPrefixTips: "When hooking, some globally unique flags will be set. You can customize the prefix.",
        flagPrefixPlaceholder: "You can customize the global prefix. If not set, the default is JSREI_js_script_hook.",
        responseDebuggerHookType: "Response Breakpoint Hook Method:",
        responseDebuggerHookTypeTips: "When hooking the callback function of JSONP, there are two ways to implement the hook: <br/><br/> One is to replace the reference of the callback function, which acts as a proxy function. This requires stepping into the callback function implementation after hitting the breakpoint. This method has better compatibility and works smoothly on most websites. <br/><br/> The other method is to directly rewrite the function body of the callback function, which is equivalent to editing and redeclaring the function's code. This allows you to place the breakpoint directly in the callback function body, but there may be some scope compatibility issues. If you encounter errors, please switch to the proxy method. <br/><br/> Note: This option takes effect after refreshing the page.",
        responseDebuggerHookTypeUseProxyFunction: "Use Proxy Function to Implement Hook",
        responseDebuggerHookTypeUseRedeclareFunction: "Directly Modify the Callback Function Body (Note: There May Be Compatibility Issues)",
        isIgnoreJsSuffixRequest: "Ignore .js Suffix Requests:",
        isIgnoreJsSuffixRequestTips: "Most of the time, requests with a .js suffix are simply loading JavaScript resource files. You can choose to ignore such requests. When checked, .js requests will not be printed on the console.",
        isIgnoreNotJsonpRequest: "Ignore Non-JSONP Requests:",
        isIgnoreNotJsonpRequestTips: "If you are only concerned with JSONP-type requests, you can choose to ignore other requests. When checked, non-JSONP requests will not be printed on the console."
    },
    debugger_config: {
        debuggerTitle: "Breakpoint Configuration",
        enable: "Enable This Breakpoint:",
        enableTips: "Whether to enable this breakpoint. It will only take effect when the breakpoint is enabled. Unchecking it can temporarily disable the breakpoint without deleting it.",
        urlPattern: "URL Matching Method:",
        urlPatternTips: "The URL matching method is used to specify when the script's URL meets certain conditions to hit this breakpoint.",
        urlPatternTypeTips: "Specify how to match the Script URL:",
        urlPatternType_EqualsThisString: "The Script URL must exactly match the given string.",
        urlPatternType_ContainsThisString: "The Script URL contains the given string.",
        urlPatternType_MatchThisRegexp: "The Script URL matches the given regular expression.",
        urlPatternType_MatchALL: "Directly match all Script URLs.",
        urlPatternTextTips: "Enter a keyword or expression.",
        urlPatternTextPlaceholder: "Enter a keyword or expression.",
        urlPatternTest: "Test",
        urlPatternTestTips: "You can enter a script URL to test whether this breakpoint hits it.",
        urlPatternTestPrompt: "Please enter the URL to test:",
        urlPatternTestResult: "Test Result:",
        enableRequestDebugger: "Enable Request Breakpoint:",
        enableRequestDebuggerTips: "After enabling the request breakpoint, the breakpoint will be triggered before the script request is sent.",
        enableResponseDebugger: "Enable Response Breakpoint:",
        enableResponseDebuggerTips: "After enabling the response breakpoint, the breakpoint will be triggered in the callback function of the JSONP request.",
        callbackFunctionParamName: "JSONP Callback Function Parameter Name:",
        callbackFunctionParamNameTips: "If not specified, the built-in engine will automatically infer the JSONP parameter name. If the inference fails, you can manually specify it.",
        callbackFunctionParamNamePlaceholder: "If not specified, the built-in engine will automatically infer the JSONP parameter name.",
        comment: "Comment:",
        commentTips: "You can enter some comments or contextual information to avoid forgetting it over time.",
        commentPlaceholder: "A good memory is not as good as a written record."
    },
    console: {
        tableKey: "key",
        tableValue: "value",
        tableComment: "comment",
        titleRequest: "Script Hook Captured Request",
        titleResponse: "Script Hook Captured Response",
        time: "Time",
        requestId: "Request ID",
        isJsonpRequest: "Is JSONP Request",
        hostname: "Request Hostname",
        path: "Request Path",
        param: "Request Parameters",
        hash: "Request #hash",
        paramName: "Parameter Name",
        paramValue: "Parameter Value",
        isJsonpCallback: "Is JSONP Callback Function",
        codeLocation: "Code Location"
    },
    tabs: {
        debuggerListTab: "Debugger List",
        globalSettingsTab: "Global Settings",
        addNewBreakpoint: "Add New Breakpoint"
    },
    // 新增确认对话框的英文翻译
    confirm_dialog: {
        deleteBreakpoint: "Delete Breakpoint",
        deleteConfirmMessage: "Are you sure you want to delete this breakpoint? This action cannot be undone.",
        okButton: "Delete",
        cancelButton: "Cancel"
    }
};

/**
 * 根据全局配置获取语言设置
 * @returns 返回当前语言的配置对象
 */
export function getLanguageByGlobalConfig(): Language {
    return getLanguage(getGlobalConfig().language);
}

/**
 * 根据指定的语言获取对应的语言配置
 * @param language - 语言类型（"chinese" 或 "english"）
 * @returns 返回指定语言的配置对象
 */
export function getLanguage(language: string): Language {
    switch (language) {
        case "chinese":
            return chinese;
        case "english":
            return english;
        default:
            return english;
    }
}

export { chinese, english }; 