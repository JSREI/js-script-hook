import { Debugger } from "../../../../debugger/debugger";

/**
 * 创建新的调试器配置
 * @returns 新的调试器配置对象
 */
export function createNewDebuggerConfig(): Debugger {
    const newDebuggerConfig = new Debugger();
    newDebuggerConfig.id = `debugger-${new Date().getTime()}`;
    newDebuggerConfig.enable = true;
    newDebuggerConfig.urlPattern = null;
    newDebuggerConfig.urlPatternType = "match-all";
    newDebuggerConfig.enableRequestDebugger = true;
    newDebuggerConfig.enableResponseDebugger = true;
    newDebuggerConfig.callbackFunctionName = null;
    newDebuggerConfig.comment = "";
    return newDebuggerConfig;
} 