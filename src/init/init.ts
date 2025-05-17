import { registerMenu, show } from '../config/ui/menu';
import { getUnsafeWindow } from '../utils/scope-util';
import { DocumentHook } from '../hook/document-hook';
import { initConfig, getGlobalConfig } from '../config/config';

declare function GM_getValue(key: string): any;
declare function GM_setValue(key: string, value: any): void;

/**
 * 验证脚本环境
 */
function validateScriptEnvironment(): void {
    console.log('[环境检查] 开始检查脚本环境');
    
    // 检查GM_setValue和GM_getValue是否可用
    if (typeof GM_setValue === 'function') {
        console.log('[环境检查] GM_setValue 可用 ✓');
    } else {
        console.error('[环境检查] GM_setValue 不可用 ✗', typeof GM_setValue);
    }
    
    if (typeof GM_getValue === 'function') {
        console.log('[环境检查] GM_getValue 可用 ✓');
    } else {
        console.error('[环境检查] GM_getValue 不可用 ✗', typeof GM_getValue);
    }
    
    // 测试存储功能
    try {
        const testKey = '__test_storage_key__';
        const testValue = 'test_value_' + Date.now();
        console.log('[环境检查] 测试存储，写入值:', testValue);
        
        GM_setValue(testKey, testValue);
        const readValue = GM_getValue(testKey);
        
        console.log('[环境检查] 测试存储，读取值:', readValue);
        console.log('[环境检查] 存储测试结果:', readValue === testValue ? '成功 ✓' : '失败 ✗');
    } catch (error) {
        console.error('[环境检查] 存储测试出错:', error);
    }
    
    console.log('[环境检查] 环境检查完成');
}

/**
 * 初始化整个脚本
 */
export function init(): void {
    console.log('[初始化] 脚本开始初始化');
    
    // 验证脚本环境
    validateScriptEnvironment();
    
    // 加载配置
    console.log('[初始化] 开始加载配置');
    initConfig();
    console.log('[初始化] 配置加载完成, 当前语言:', getGlobalConfig().language);

    // 增加可视化的配置
    registerMenu();

    // 为document增加hook点
    new DocumentHook(getUnsafeWindow().document).addHook();

    if (GM_getValue("js-script-hook-open-configuration")) {
        GM_setValue("js-script-hook-open-configuration", false);
        show();
    }
    
    console.log('[初始化] 脚本初始化完成');
} 