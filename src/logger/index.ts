/**
 * JS-Script-Hook日志模块
 * 
 * 提供统一的日志输出接口，支持彩色输出和标准化前缀，
 * 便于识别和区分日志信息来源。
 */

// 日志级别枚举
export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    NONE = 100 // 不输出任何日志
}

// 日志配置
export interface LoggerConfig {
    prefix: string;       // 日志前缀
    level: LogLevel;      // 日志输出级别
    useColors: boolean;   // 是否使用颜色
    useTimestamp: boolean; // 是否显示时间戳
}

// 默认配置
const DEFAULT_CONFIG: LoggerConfig = {
    prefix: '[JSREI]',
    level: LogLevel.INFO,
    useColors: true,
    useTimestamp: true
};

// 颜色定义
const COLORS = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    underscore: '\x1b[4m',
    blink: '\x1b[5m',
    reverse: '\x1b[7m',
    hidden: '\x1b[8m',
    
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    
    bgBlack: '\x1b[40m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
    bgWhite: '\x1b[47m'
};

// 浏览器环境支持的颜色样式
const BROWSER_STYLES = {
    debug: 'color: #6c757d; font-weight: normal;',  // 灰色
    info: 'color: #0dcaf0; font-weight: bold;',     // 青色
    warn: 'color: #ffc107; font-weight: bold;',     // 黄色
    error: 'color: #dc3545; font-weight: bold;',    // 红色
    prefix: 'color: #6610f2; font-weight: bold;',   // 紫色
    timestamp: 'color: #6c757d;',                   // 灰色
    module: 'color: #20c997; font-weight: normal;', // 青绿色
    reset: ''
};

// 当前配置
let currentConfig: LoggerConfig = { ...DEFAULT_CONFIG };

/**
 * 初始化日志模块
 * @param config 日志配置
 */
export function initLogger(config: Partial<LoggerConfig> = {}): void {
    currentConfig = { ...DEFAULT_CONFIG, ...config };
    debug('Logger initialized', 'logger');
}

/**
 * 格式化日志消息
 */
function formatMessage(level: string, message: string, module?: string): { text: string, args: any[] } {
    const timestamp = currentConfig.useTimestamp ? new Date().toISOString().replace('T', ' ').replace('Z', '').substring(0, 19) : '';
    const moduleStr = module ? `[${module}]` : '';
    const prefix = currentConfig.prefix;
    
    // 检测是否在浏览器环境且支持颜色
    const isBrowser = typeof window !== 'undefined';
    // 浏览器环境下假定支持颜色，只根据配置决定
    const supportsColor = currentConfig.useColors;
    
    if (!supportsColor) {
        // 无颜色版本
        return { 
            text: `${timestamp ? timestamp + ' ' : ''}${prefix} ${level.toUpperCase()}${moduleStr ? ' ' + moduleStr : ''}: %s`,
            args: [message]
        };
    }
    
    if (isBrowser) {
        // 浏览器环境使用CSS样式
        let formatParts = [];
        let styleArgs = [];
        
        if (timestamp) {
            formatParts.push('%c%s%c');
            styleArgs.push(BROWSER_STYLES.timestamp, timestamp, BROWSER_STYLES.reset);
        }
        
        formatParts.push('%c%s%c');
        styleArgs.push(BROWSER_STYLES.prefix, prefix, BROWSER_STYLES.reset);
        
        formatParts.push('%c%s%c');
        styleArgs.push(BROWSER_STYLES[level as keyof typeof BROWSER_STYLES], level.toUpperCase(), BROWSER_STYLES.reset);
        
        if (moduleStr) {
            formatParts.push('%c%s%c');
            styleArgs.push(BROWSER_STYLES.module, moduleStr, BROWSER_STYLES.reset);
        }
        
        formatParts.push(': %s');
        return { text: formatParts.join(' '), args: [...styleArgs, message] };
    } else {
        // Node.js环境使用ANSI颜色代码
        const levelColors = {
            debug: COLORS.dim,
            info: COLORS.cyan,
            warn: COLORS.yellow,
            error: COLORS.red
        };
        
        const levelColor = levelColors[level as keyof typeof levelColors] || COLORS.white;
        const timestampStr = timestamp ? `${COLORS.dim}${timestamp}${COLORS.reset} ` : '';
        const prefixStr = `${COLORS.magenta}${COLORS.bright}${prefix}${COLORS.reset}`;
        const levelStr = `${levelColor}${level.toUpperCase()}${COLORS.reset}`;
        const moduleDisplay = moduleStr ? ` ${COLORS.green}${moduleStr}${COLORS.reset}` : '';
        
        return { 
            text: `${timestampStr}${prefixStr} ${levelStr}${moduleDisplay}: %s`,
            args: [message]
        };
    }
}

/**
 * 基础日志函数
 */
function log(level: 'debug' | 'info' | 'warn' | 'error', message: any, module?: string): void {
    const logLevel = ({
        'debug': LogLevel.DEBUG,
        'info': LogLevel.INFO,
        'warn': LogLevel.WARN,
        'error': LogLevel.ERROR
    })[level];
    
    // 检查日志级别
    if (logLevel < currentConfig.level) {
        return;
    }
    
    // 转换非字符串消息
    const msgString = typeof message === 'string' 
        ? message 
        : (typeof message === 'object' && message !== null)
            ? JSON.stringify(message, null, 2)
            : String(message);
    
    // 格式化消息
    const { text, args } = formatMessage(level, msgString, module);
    
    // 输出日志
    switch (level) {
        case 'debug':
            console.debug(text, ...args);
            break;
        case 'info':
            console.info(text, ...args);
            break;
        case 'warn':
            console.warn(text, ...args);
            break;
        case 'error':
            console.error(text, ...args);
            break;
    }
}

/**
 * 调试日志
 * @param message 消息内容
 * @param module 模块名称
 */
export function debug(message: any, module?: string): void {
    log('debug', message, module);
}

/**
 * 信息日志
 * @param message 消息内容
 * @param module 模块名称
 */
export function info(message: any, module?: string): void {
    log('info', message, module);
}

/**
 * 警告日志
 * @param message 消息内容
 * @param module 模块名称
 */
export function warn(message: any, module?: string): void {
    log('warn', message, module);
}

/**
 * 错误日志
 * @param message 消息内容
 * @param module 模块名称
 */
export function error(message: any, module?: string): void {
    log('error', message, module);
}

/**
 * 设置日志级别
 * @param level 日志级别
 */
export function setLogLevel(level: LogLevel): void {
    currentConfig.level = level;
    debug(`Log level set to: ${LogLevel[level]}`, 'logger');
}

/**
 * 启用/禁用颜色输出
 * @param enable 是否启用
 */
export function setUseColors(enable: boolean): void {
    currentConfig.useColors = enable;
    debug(`Color output ${enable ? 'enabled' : 'disabled'}`, 'logger');
}

/**
 * 创建特定模块的日志记录器
 * @param moduleName 模块名称
 */
export function createLogger(moduleName: string) {
    return {
        debug: (message: any) => debug(message, moduleName),
        info: (message: any) => info(message, moduleName),
        warn: (message: any) => warn(message, moduleName),
        error: (message: any) => error(message, moduleName)
    };
}

// 导出日志实例
export default {
    debug,
    info,
    warn,
    error,
    setLogLevel,
    setUseColors,
    createLogger,
    LogLevel
}; 