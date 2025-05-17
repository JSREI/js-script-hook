/**
 * 存储工具类，提供更可靠的存储API
 * 
 * 这个工具类包装了GM_setValue和GM_getValue，添加了额外的错误处理和回退机制，
 * 确保在不同的脚本管理器环境中都能正常工作。
 */

// 声明油猴API
declare const GM_getValue: (key: string) => string | undefined;
declare const GM_setValue: (key: string, value: string) => void;

// 备用存储：如果GM API不可用，尝试使用localStorage
class FallbackStorage {
    static prefix = 'js_script_hook_';
    
    static getValue(key: string): string | undefined {
        try {
            return localStorage.getItem(this.prefix + key) || undefined;
        } catch (error) {
            console.error('[存储] 从localStorage读取失败:', error);
            return undefined;
        }
    }
    
    static setValue(key: string, value: string): void {
        try {
            localStorage.setItem(this.prefix + key, value);
        } catch (error) {
            console.error('[存储] 写入localStorage失败:', error);
        }
    }
}

/**
 * 检查GM存储API是否可用
 */
function isGMStorageAvailable(): boolean {
    try {
        // 尝试读写一个测试值
        const testKey = '__test_gm_storage_';
        const testValue = 'test_' + Date.now();
        
        if (typeof GM_setValue !== 'function' || typeof GM_getValue !== 'function') {
            console.warn('[存储] GM存储API不完整');
            return false;
        }
        
        GM_setValue(testKey, testValue);
        const result = GM_getValue(testKey);
        
        if (result !== testValue) {
            console.warn('[存储] GM存储API读写不一致');
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('[存储] GM存储API测试失败:', error);
        return false;
    }
}

// 存储API的可用性
const useGMStorage = isGMStorageAvailable();
console.log('[存储] 使用GM存储API:', useGMStorage);

/**
 * 保存值到存储
 * @param key 键名
 * @param value 值
 */
export function saveValue(key: string, value: string): void {
    try {
        console.log(`[存储] 保存配置 ${key}:`, value);
        
        if (useGMStorage) {
            GM_setValue(key, value);
            console.log('[存储] 使用GM API保存成功');
        } else {
            FallbackStorage.setValue(key, value);
            console.log('[存储] 使用回退存储保存成功');
        }
    } catch (error) {
        console.error('[存储] 保存失败:', error);
    }
}

/**
 * 从存储中读取值
 * @param key 键名
 * @returns 存储的值，如果不存在则返回undefined
 */
export function loadValue(key: string): string | undefined {
    try {
        let value: string | undefined;
        
        if (useGMStorage) {
            value = GM_getValue(key);
            console.log(`[存储] 从GM API读取 ${key}:`, value);
        } else {
            value = FallbackStorage.getValue(key);
            console.log(`[存储] 从回退存储读取 ${key}:`, value);
        }
        
        return value;
    } catch (error) {
        console.error(`[存储] 读取 ${key} 失败:`, error);
        return undefined;
    }
} 