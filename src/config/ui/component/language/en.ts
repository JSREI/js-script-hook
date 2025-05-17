/**
 * 英文语言包
 */
import { Language } from './types';

/**
 * 英文语言配置
 */
export const english: Language = {
    global_settings: {
        title: "Global Settings",
        language: "界面语言：",
        languageTips: "You can modify the language of this configuration interface, and the changes will take effect immediately!",
        flagPrefix: "Hook Flag Prefix:",
        flagPrefixTips: "When hooking, some globally unique flags will be set. You can customize the prefix.",
        flagPrefixPlaceholder: "You can customize the global prefix. If not set, the default is JSREI_js_script_hook",
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
        urlPatternKeyword: "Matching Keyword:",
        urlPatternTypeTips: "Specify how to match the Script URL:",
        urlPatternType_EqualsThisString: "The Script URL must exactly match the given string.",
        urlPatternType_ContainsThisString: "The Script URL contains the given string.",
        urlPatternType_MatchThisRegexp: "The Script URL matches the given regular expression.",
        urlPatternType_MatchALL: "Directly match all Script URLs.",
        urlPatternTextTips: "Enter a keyword or expression.",
        urlPatternTextPlaceholder: "Enter a keyword or expression.",
        urlPatternMatchAllDisabledText: "No keyword needed in \"Match All URLs\" mode",
        urlPatternTest: "Test",
        urlPatternTestTips: "You can enter a script URL to test whether this breakpoint hits it.",
        urlPatternTestPrompt: "Please enter the URL to test:",
        urlPatternTestResult: "Test Result:",
        urlPatternTestMatch: "✅ Match",
        urlPatternTestNotMatch: "❌ Not Match",
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
        addNewBreakpoint: "Add New Breakpoint",
        aboutTab: "About"
    },
    confirm_dialog: {
        deleteBreakpoint: "Delete Breakpoint",
        deleteConfirmMessage: "Are you sure you want to delete this breakpoint? This action cannot be undone.",
        okButton: "Delete",
        cancelButton: "Cancel",
        closeWindow: "Close Window"
    },
    about: {
        feedback: {
            title: "Feedback",
            content: "If you encounter any issues or have suggestions for improvement, please feel free to submit a GitHub Issue. We will address your concerns as soon as possible.",
            submitIssue: "Submit Issue"
        },
        project: {
            title: "Project Information",
            starMe: "Star Me"
        },
        group: {
            title: "Reverse Engineering Community",
            content: "Scan QR code to join our WeChat group:",
            wechatGroup: "WeChat Group",
            personalWechat: "If the group QR code expires, add my personal WeChat and send [Reverse Group] to join:",
            telegramGroup: "Telegram Group",
            telegramLink: "Click here or scan QR code to join Telegram group"
        },
        organization: {
            title: "About JSREI",
            content: "JSREI (JavaScript Reverse Engineering Institute) is an open-source technical community dedicated to JavaScript reverse engineering and Web security research."
        }
    },
    basic: {
        okButton: 'OK',
        cancelButton: 'Cancel',
        confirmButton: 'Confirm',
        deleteButton: 'Delete',
        closeButton: 'Close',
        testButton: 'Test',
        saveButton: 'Save',
        inputDialog: {
            defaultOkText: 'OK',
            defaultCancelText: 'Cancel'
        },
        confirmDialog: {
            defaultOkText: 'OK',
            defaultCancelText: 'Cancel'
        },
        select: {
            placeholder: 'Please select'
        }
    }
}; 