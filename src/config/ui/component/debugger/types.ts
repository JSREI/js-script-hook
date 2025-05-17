/**
 * URL匹配类型枚举
 */
export type UrlPatternType = 'equals-string' | 'contains-string' | 'match-regexp' | 'match-all';

/**
 * Hook类型枚举
 */
export type HookType = 'redeclare' | 'proxy';

/**
 * 调试器配置接口
 */
export interface DebuggerConfig {
    id: string;
    enable: boolean;
    urlPattern: string;
    urlPatternType: UrlPatternType;
    hookType: HookType;
    enableRequestDebugger: boolean;
    enableResponseDebugger: boolean;
    comment: string;
    callbackFunctionName: string;
} 