// 中文菜单
const chinese = {
    global_settings: {

        title: "全局设置",

        language: "界面语言：",
        languageTips: "你可以修改此配置界面的语言，修改后下次进入生效！",

        flagPrefix: "Hook Flag前缀：",
        flagPrefixTips: "在Hook的时候会设置一些全局唯一的标志位，你可以个性化修改为自定义的前缀",
        flagPrefixPlaceholder: "可自定义全局前缀，未设置默认为 CC11001100_js_script_hook",

        isIgnoreJsSuffixRequest: "是否忽略.js后缀的请求：",
        isIgnoreJsSuffixRequestTips: "大多数时候.js后缀的请求都是单纯的加载JavaScript资源文件，可以选择忽略掉这类请求，当勾选的时候，控制台上也不会再打印.js请求",

        isIgnoreNotJsonpRequest: "是否忽略不是jsonp的请求：",
        isIgnoreNotJsonpRequestTips: "如果只关注jsonp类型的请求，可以选择忽略掉其它请求，当勾选的时候，控制台上也不会再打印非jsonp请求",

        autoJumpProjectSiteOnConfiguraion: "跳转到项目主页打开此界面以防样式错乱：",
        autoJumpProjectSiteOnConfiguraionTips: "油猴脚本注入的界面可能会跟网页中原有的样式发生冲突或者污染，从而导致样式错乱，跳转到经过测试的项目主页打开设置界面可以有效防止布局错乱",
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
        enableRequestDebuggerTips: "启动请求断点后，在script请求发出之前进入断点",

        enableResponseDebugger: "是否开启响应断点：",
        enableResponseDebuggerTips: "启动响应断点之后，在jsonp请求的回调函数中命中断点",

        callbackFunctionParamName: "jsonp回调函数参数名称：",
        callbackFunctionParamNameTips: "不指定的话会使用内置引擎自动推测jsonp参数名称，推测失败的话可以手动指定",
        callbackFunctionParamNamePlaceholder: "不指定的话会使用内置引擎自动推测jsonp参数名称",

        comment: "备注：",
        commentTips: "你可以输入一些备注，或者相关信息的一些上下文，以防止时间长了之后忘记。",
        commentPlaceholder: "好记性不如烂笔头",
    }
};

// 英文菜单
const english = {
    global_settings: {

        title: "Global Settings",

        language: "语言",
        languageTips: "语言",

        flagPrefix: "Flag前缀",
        flagPrefixTips: "Flag前缀",
        flagPrefixPlaceholder: "xxx",

        isIgnoreJsSuffixRequest: "忽略.js后缀的请求",
        isIgnoreJsSuffixRequestTips: "忽略.js后缀的请求",

        isIgnoreNotJsonpRequest: "忽略不是jsonp的请求",
        isIgnoreNotJsonpRequestTips: "忽略不是jsonp的请求",

        autoJumpProjectSiteOnConfiguraion: "打开此界面时自动跳转到项目主页以防样式错乱",
        autoJumpProjectSiteOnConfiguraionTips: "打开此界面时自动跳转到项目主页以防样式错乱",
    },
    debugger_config: {
        enable: "是否启用",
        enableTips: "是否启用此断点，仅当断点处于启用状态的时候才会生效，取消勾选可以暂时禁用断点而无需删除。",

        urlPattern: "URL匹配方式",
        urlPatternTips: "",

        urlPatternTypeTips: "",
        urlPatternType_EqualsThisString: "Equals This String",
        urlPatternType_ContainsThisString: "Contains This String",
        urlPatternType_MatchThisRegexp: "Match This Regexp",
        urlPatternType_MatchALL: "Match ALL",

        urlPatternTextTips: "",
        urlPatternTextPlaceholder: "关键字或正则表达式",

        urlPatternTest: "测试",
        urlPatternTestTips: "你可以输入一个script url测试此断点对其命中情况",

        enableRequestDebugger: "是否启动请求断点",
        enableRequestDebuggerTips: "启动请求断点后，在script请求发出之前进入断点",

        enableResponseDebugger: "是否启用响应断点",
        enableResponseDebuggerTips: "启动响应断点之后，在jsonp请求的回调函数中命中断点",

        callbackFunctionParamName: "jsonp回调函数参数名称",
        callbackFunctionParamNameTips: "",
        callbackFunctionParamNamePlaceholder: "",

        comment: "备注",
        commentTips: "你可以输入一些备注，或者相关信息的一些上下文，以防止时间长了之后忘记。",
        commentPlaceholder: "好记性不如烂笔头",
    }
};

/**
 *
 * @param language
 * @return {{debugger_config: {urlPatternTest: string, urlPatternTestTips: string, enableTips: string, commentPlaceholder: string, debuggerTitle: string, enableRequestDebuggerTips: string, enableResponseDebugger: string, enableRequestDebugger: string, callbackFunctionParamName: string, urlPatternTypeTips: string, urlPatternTips: string, urlPatternType_MatchThisRegexp: string, urlPatternType_MatchALL: string, urlPatternType_EqualsThisString: string, urlPatternTextPlaceholder: string, enable: string, commentTips: string, urlPatternTextTips: string, enableResponseDebuggerTips: string, callbackFunctionParamNameTips: string, callbackFunctionParamNamePlaceholder: string, comment: string, urlPattern: string, urlPatternType_ContainsThisString: string}, global_settings: {languageTips: string, autoJumpProjectSiteOnConfiguraionTips: string, flagPrefix: string, flagPrefixTips: string, isIgnoreJsSuffixRequestTips: string, autoJumpProjectSiteOnConfiguraion: string, isIgnoreJsSuffixRequest: string, language: string, isIgnoreNotJsonpRequestTips: string, title: string, flagPrefixPlaceholder: string, isIgnoreNotJsonpRequest: string}}|{debugger_config: {urlPatternTest: string, urlPatternTestTips: string, enableTips: string, commentPlaceholder: string, enableRequestDebuggerTips: string, enableResponseDebugger: string, enableRequestDebugger: string, callbackFunctionParamName: string, urlPatternTypeTips: string, urlPatternTips: string, urlPatternType_MatchThisRegexp: string, urlPatternType_MatchALL: string, urlPatternType_EqualsThisString: string, urlPatternTextPlaceholder: string, enable: string, commentTips: string, urlPatternTextTips: string, enableResponseDebuggerTips: string, callbackFunctionParamNameTips: string, callbackFunctionParamNamePlaceholder: string, comment: string, urlPattern: string, urlPatternType_ContainsThisString: string}, global_settings: {languageTips: string, autoJumpProjectSiteOnConfiguraionTips: string, flagPrefix: string, flagPrefixTips: string, isIgnoreJsSuffixRequestTips: string, autoJumpProjectSiteOnConfiguraion: string, isIgnoreJsSuffixRequest: string, language: string, isIgnoreNotJsonpRequestTips: string, title: string, flagPrefixPlaceholder: string, isIgnoreNotJsonpRequest: string}}}
 */
function getLanguage(language) {
    switch (language) {
        case "chinese":
            return chinese;
        case "english":
            return english;
        default:
            return english;
    }
}

module.exports = {
    getLanguage,
    chinese,
    english
}
