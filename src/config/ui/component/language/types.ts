/**
 * 语言类型定义文件 - 包含所有语言相关接口
 */

/**
 * 控制台相关语言接口
 */
export interface ConsoleLanguage {
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

/**
 * 调试器配置语言接口
 */
export interface DebuggerConfigLanguage {
    debuggerTitle: string;
    enable: string;
    enableTips: string;
    urlPattern: string;
    urlPatternTips: string;
    urlPatternKeyword: string;
    urlPatternTypeTips: string;
    urlPatternType_EqualsThisString: string;
    urlPatternType_ContainsThisString: string;
    urlPatternType_MatchThisRegexp: string;
    urlPatternType_MatchALL: string;
    urlPatternTextTips: string;
    urlPatternTextPlaceholder: string;
    urlPatternMatchAllDisabledText: string;
    urlPatternTest: string;
    urlPatternTestTips: string;
    urlPatternTestPrompt: string;
    urlPatternTestResult: string;
    urlPatternTestMatch: string;
    urlPatternTestNotMatch: string;
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

/**
 * 全局设置语言接口
 */
export interface GlobalSettingsLanguage {
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

/**
 * 标签页语言接口
 */
export interface TabsLanguage {
    debuggerListTab: string;
    globalSettingsTab: string;
    addNewBreakpoint: string;
    aboutTab: string;
}

/**
 * 确认对话框语言接口
 */
export interface ConfirmDialogLanguage {
    deleteBreakpoint: string;
    deleteConfirmMessage: string;
    okButton: string;
    cancelButton: string;
    closeWindow: string;
}

/**
 * 关于页面语言接口
 */
export interface AboutLanguage {
    feedback: {
        title: string;
        content: string;
        submitIssue: string;
    };
    project: {
        title: string;
        starMe: string;
    };
    group: {
        title: string;
        content: string;
        wechatGroup: string;
        personalWechat: string;
        telegramGroup: string;
        telegramLink: string;
    };
    organization: {
        title: string;
        content: string;
    };
}

/**
 * 基础组件语言接口
 */
export interface BasicComponentsLanguage {
    // 通用按钮文本
    okButton: string;
    cancelButton: string;
    confirmButton: string;
    deleteButton: string;
    closeButton: string;
    testButton: string;
    saveButton: string;
    
    // 输入对话框
    inputDialog: {
        defaultOkText: string;
        defaultCancelText: string;
    };
    
    // 确认对话框
    confirmDialog: {
        defaultOkText: string;
        defaultCancelText: string;
    };
    
    // 选择框
    select: {
        placeholder: string;
    };
}

/**
 * 主语言接口，组合所有子接口
 */
export interface Language {
    global_settings: GlobalSettingsLanguage;
    debugger_config: DebuggerConfigLanguage;
    console: ConsoleLanguage;
    tabs: TabsLanguage;
    confirm_dialog: ConfirmDialogLanguage;
    about: AboutLanguage;
    basic: BasicComponentsLanguage;
}

/**
 * 语言类型
 */
export type LanguageType = "english" | "chinese"; 