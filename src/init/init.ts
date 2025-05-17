import { registerMenu, show } from '../config/ui/menu';
import { getUnsafeWindow } from '../utils/scope-util';
import { DocumentHook } from '../hook/document-hook';
import { initConfig, getGlobalConfig } from '../config/config';
import { initLogger, LogLevel, createLogger } from '../logger';
import { initTrustedTypesPolicy } from '../jQuery-lite';

declare function GM_getValue(key: string): any;
declare function GM_setValue(key: string, value: any): void;

// 创建初始化模块的专用日志记录器
const initModuleLogger = createLogger('init');

/**
 * 验证脚本环境
 */
function validateScriptEnvironment(): void {
    initModuleLogger.info('开始检查脚本环境');
    
    // 检查GM_setValue和GM_getValue是否可用
    if (typeof GM_setValue === 'function') {
        initModuleLogger.info('GM_setValue 可用 ✓');
    } else {
        initModuleLogger.error('GM_setValue 不可用 ✗ ' + typeof GM_setValue);
    }
    
    if (typeof GM_getValue === 'function') {
        initModuleLogger.info('GM_getValue 可用 ✓');
    } else {
        initModuleLogger.error('GM_getValue 不可用 ✗ ' + typeof GM_getValue);
    }
    
    // 测试存储功能
    try {
        const testKey = '__test_storage_key__';
        const testValue = 'test_value_' + Date.now();
        initModuleLogger.debug('测试存储，写入值: ' + testValue);
        
        GM_setValue(testKey, testValue);
        const readValue = GM_getValue(testKey);
        
        initModuleLogger.debug('测试存储，读取值: ' + readValue);
        const isSuccess = readValue === testValue;
        if (isSuccess) {
            initModuleLogger.info('存储测试成功 ✓');
        } else {
            initModuleLogger.error('存储测试失败 ✗');
        }
    } catch (error) {
        initModuleLogger.error('存储测试出错: ' + error);
    }
    
    initModuleLogger.info('环境检查完成');
}

/**
 * 初始化整个脚本
 */
export function init(): void {
    // 首先初始化日志模块
    initLogger({
        level: LogLevel.DEBUG,  // 默认输出所有级别的日志
        prefix: '[JSREI]',
        useTimestamp: true,
        useColors: true
    });
    
    // 创建应用级别的日志记录器
    const appLogger = createLogger('app');
    
    // 记录初始化开始
    appLogger.info('JS-Script-Hook 开始初始化');
    
    // 初始化TrustedTypes策略
    initTrustedTypesPolicy();
    
    // 验证脚本环境
    validateScriptEnvironment();
    
    // 加载配置
    initModuleLogger.info('开始加载配置');
    initConfig();
    initModuleLogger.info('配置加载完成, 当前语言: ' + getGlobalConfig().language);

    // 增加可视化的配置
    registerMenu();
    initModuleLogger.debug('注册菜单完成');

    // 为document增加hook点
    new DocumentHook(getUnsafeWindow().document).addHook();
    initModuleLogger.debug('Document钩子已添加');

    if (GM_getValue("js-script-hook-open-configuration")) {
        GM_setValue("js-script-hook-open-configuration", false);
        show();
        initModuleLogger.debug('自动打开配置界面');
    }
    
    // 记录初始化完成
    appLogger.info('JS-Script-Hook 初始化完成');
} 