/**
 * 中文语言包
 */
import { Language } from './types';

/**
 * 中文语言配置
 */
export const chinese: Language = {
    global_settings: {
        title: "全局设置",
        language: "Interface Language:",
        languageTips: "你可以修改此配置界面的语言，修改后立即生效！ <br/> You can modify the language of this configuration interface, and the changes will take effect immediately!",
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
        urlPatternKeyword: "匹配关键字：",
        urlPatternTypeTips: "指定以什么方式匹配Script URL：",
        urlPatternType_EqualsThisString: "Script URL需要完全匹配给定的字符串",
        urlPatternType_ContainsThisString: "Script URL包含给定的字符串",
        urlPatternType_MatchThisRegexp: "Script URL匹配给定的正则表达式",
        urlPatternType_MatchALL: "直接匹配所有Script URL",
        urlPatternTextTips: "输入关键字或者表达式",
        urlPatternTextPlaceholder: "输入关键字或者表达式",
        urlPatternMatchAllDisabledText: "在\"匹配所有URL\"模式下不需要填写关键字",
        urlPatternTest: "测试",
        urlPatternTestTips: "你可以输入一个script url测试此断点对其命中情况",
        urlPatternTestPrompt: "请输入要测试的URL：",
        urlPatternTestResult: "测试结果：",
        urlPatternTestMatch: "✅ 匹配",
        urlPatternTestNotMatch: "❌ 不匹配",
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
        addNewBreakpoint: "添加新的断点",
        aboutTab: "关于"
    },
    confirm_dialog: {
        deleteBreakpoint: "删除断点",
        deleteConfirmMessage: "确定要删除此断点吗？删除后将无法恢复。",
        okButton: "删除",
        cancelButton: "取消",
        closeWindow: "关闭窗口"
    },
    about: {
        feedback: {
            title: "问题反馈",
            content: "如果您在使用过程中遇到任何问题或有改进建议，欢迎提交GitHub Issue，我们会尽快处理您的反馈。",
            submitIssue: "提交Issue"
        },
        project: {
            title: "项目信息",
            starMe: "Star 一下"
        },
        group: {
            title: "逆向技术交流群",
            content: "扫码加入逆向技术微信交流群：",
            wechatGroup: "微信群",
            personalWechat: "如群二维码过期，可以加我个人微信，发送【逆向群】拉你进群：",
            telegramGroup: "Telegram群",
            telegramLink: "点此或扫码加入TG交流群"
        },
        organization: {
            title: "关于JSREI",
            content: "JSREI（JavaScript逆向工程研究所）是一个专注于JavaScript逆向工程和Web安全研究的开源技术社区。"
        }
    },
    basic: {
        okButton: '确定',
        cancelButton: '取消',
        confirmButton: '确认',
        deleteButton: '删除',
        closeButton: '关闭',
        testButton: '测试',
        saveButton: '保存',
        inputDialog: {
            defaultOkText: '确定',
            defaultCancelText: '取消'
        },
        confirmDialog: {
            defaultOkText: '确定',
            defaultCancelText: '取消'
        },
        select: {
            placeholder: '请选择'
        }
    }
}; 