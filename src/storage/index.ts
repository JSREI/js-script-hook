/**
 * 油猴脚本存储工具类
 * 
 * 专门用于油猴脚本的存储API封装，增强错误处理和调试功能
 * 确保在不同的脚本管理器环境中都能正常工作
 */

import { createLogger } from '../logger';

// 创建存储模块专用的日志记录器
const storageLogger = createLogger('storage');

// 声明油猴API - 兼容各种类型声明
declare const GM_getValue: ((key: string, defaultValue?: any) => any) | undefined;
declare const GM_setValue: ((key: string, value: any) => void) | undefined;
declare const GM: { getValue?: (key: string, defaultValue?: any) => any; setValue?: (key: string, value: any) => void } | undefined;

/**
 * 诊断油猴环境并确定使用的存储API类型
 */
function diagnoseGMStorageAPI(): { getValue: (key: string, defaultValue?: any) => any; setValue: (key: string, value: any) => void } {
    storageLogger.info('开始诊断油猴存储API...');
    
    // 创建最终返回的API对象
    const api = {
        getValue: (key: string, defaultValue?: any): any => {
            storageLogger.error('无法获取值, 存储API不可用');
            return defaultValue;
        },
        setValue: (key: string, value: any): void => {
            storageLogger.error('无法保存值, 存储API不可用');
        }
    };
    
    try {
        // 第一种情况: 标准的GM_setValue和GM_getValue
        if (typeof GM_setValue === 'function' && typeof GM_getValue === 'function') {
            storageLogger.info('检测到标准GM_setValue/GM_getValue API');
            
            // 验证API是否按预期工作
            const testKey = '__gm_api_test_' + Date.now();
            const testValue = 'test_value_' + Date.now();
            
            try {
                GM_setValue(testKey, testValue);
                const readValue = GM_getValue(testKey);
                
                if (readValue === testValue) {
                    storageLogger.info('标准GM API测试成功');
                    api.getValue = (key: string, defaultValue?: any) => GM_getValue(key) ?? defaultValue;
                    api.setValue = GM_setValue;
                    return api;
                } else {
                    storageLogger.warn(`标准GM API测试失败，读写结果不一致: 写入=${testValue}, 读取=${readValue}`);
                }
            } catch (e) {
                storageLogger.warn(`标准GM API使用出错: ${e}`);
            }
        }
        
        // 第二种情况: GM对象上的方法 (Tampermonkey新版本和部分其他管理器)
        if (typeof GM !== 'undefined' && GM && typeof GM.setValue === 'function' && typeof GM.getValue === 'function') {
            storageLogger.info('检测到GM对象API');
            
            // 验证API是否按预期工作
            const testKey = '__gm_object_test_' + Date.now();
            const testValue = 'test_value_' + Date.now();
            
            try {
                GM.setValue(testKey, testValue);
                const readResult = GM.getValue(testKey);
                
                // 处理Promise或直接值
                if (readResult !== undefined && readResult !== null && typeof readResult === 'object' && 'then' in readResult) {
                    storageLogger.info('GM.getValue返回Promise, 使用异步API');
                    // 注意：由于我们维持同步API，这里只是检测，不会更改返回类型
                    const promiseValue = readResult as Promise<any>;
                    promiseValue.then(readValue => {
                        if (readValue === testValue) {
                            storageLogger.info('GM对象异步API测试成功');
                        } else {
                            storageLogger.warn('GM对象异步API测试失败, 读写结果不一致');
                        }
                    });
                    
                    // 为同步API赋值，但记录警告
                    storageLogger.warn('检测到异步存储API，但当前实现需要同步API，可能存在兼容性问题');
                } else if (readResult === testValue) {
                    storageLogger.info('GM对象同步API测试成功');
                    api.getValue = (key: string, defaultValue?: any) => GM.getValue!(key) ?? defaultValue;
                    api.setValue = GM.setValue!;
                    return api;
                }
            } catch (e) {
                storageLogger.warn(`GM对象API使用出错: ${e}`);
            }
        }
        
        // 如果以上都失败，尝试猜测GM_setValue和GM_getValue可能是不同格式
        storageLogger.warn('标准方法未能成功，尝试进行深度诊断...');
        
        // 提供一个最后的回退函数，它会尝试多种可能的API调用形式
        api.setValue = (key: string, value: any): void => {
            try {
                if (typeof GM_setValue === 'function') {
                    GM_setValue(key, value);
                    storageLogger.debug(`尝试使用GM_setValue保存 ${key}`);
                    return;
                }
                
                if (typeof GM !== 'undefined' && GM && typeof GM.setValue === 'function') {
                    try {
                        const result = GM.setValue(key, value);
                        // 只有当result不是undefined或null时，才检查它是否是Promise
                        if (result !== undefined && result !== null && typeof result === 'object' && 'then' in result) {
                            const promiseResult = result as Promise<void>;
                            promiseResult.catch(err => storageLogger.error(`异步保存失败: ${err}`));
                        }
                        storageLogger.debug(`尝试使用GM.setValue保存 ${key}`);
                        return;
                    } catch (e) {
                        storageLogger.error(`GM.setValue调用失败: ${e}`);
                    }
                }
                
                storageLogger.error('所有已知存储API尝试失败，无法保存配置');
            } catch (error) {
                storageLogger.error(`保存时发生未知错误: ${error}`);
            }
        };
        
        api.getValue = (key: string, defaultValue?: any): any => {
            try {
                if (typeof GM_getValue === 'function') {
                    const value = GM_getValue(key);
                    storageLogger.debug(`尝试使用GM_getValue读取 ${key}: ${value}`);
                    return value ?? defaultValue;
                }
                
                if (typeof GM !== 'undefined' && GM && typeof GM.getValue === 'function') {
                    try {
                        const result = GM.getValue(key);
                        // 只有当result不是undefined或null时，才检查它是否是Promise
                        if (result !== undefined && result !== null && typeof result === 'object' && 'then' in result) {
                            storageLogger.warn(`GM.getValue返回Promise，无法同步读取 ${key}`);
                            return defaultValue;
                        }
                        storageLogger.debug(`尝试使用GM.getValue读取 ${key}: ${result}`);
                        return result ?? defaultValue;
                    } catch (e) {
                        storageLogger.error(`GM.getValue调用失败: ${e}`);
                        return defaultValue;
                    }
                }
                
                storageLogger.error('所有已知存储API尝试失败，无法读取配置');
                return defaultValue;
            } catch (error) {
                storageLogger.error(`读取${key}时发生未知错误: ${error}`);
                return defaultValue;
            }
        };
    } catch (error) {
        storageLogger.error(`诊断过程发生未知错误: ${error}`);
    }
    
    storageLogger.warn('未能找到可靠的存储API，将使用有限功能的回退方式');
    return api;
}

// 获取适配后的存储API
const storageAPI = diagnoseGMStorageAPI();

/**
 * 保存值到存储
 * @param key 键名
 * @param value 值(会被JSON序列化)
 */
export function saveValue(key: string, value: any): void {
    try {
        // 检查值类型
        if (typeof value === 'object') {
            // 对象类型转为JSON字符串
            value = JSON.stringify(value);
        } else if (value === undefined) {
            storageLogger.warn(`保存的值为undefined，使用null替代`);
            value = null;
        }
        
        storageLogger.info(`正在保存配置 ${key}`);
        storageLogger.debug(`保存内容: ${value}`);
        
        // 使用检测到的最佳API保存值
        storageAPI.setValue(key, value);
        
        // 验证保存是否成功
        try {
            const savedValue = storageAPI.getValue(key);
            if (savedValue !== value && JSON.stringify(savedValue) !== JSON.stringify(value)) {
                storageLogger.warn(`保存验证不一致: 期望=${value}, 实际=${savedValue}`);
            } else {
                storageLogger.debug('保存验证成功');
            }
        } catch (verifyError) {
            storageLogger.error(`保存验证失败: ${verifyError}`);
        }
    } catch (error) {
        storageLogger.error(`保存 ${key} 失败: ${error}`);
    }
}

/**
 * 从存储中读取值
 * @param key 键名
 * @param defaultValue 默认值，如果读取失败或不存在时返回
 * @returns 存储的值，已自动尝试解析JSON
 */
export function loadValue(key: string, defaultValue?: any): any {
    try {
        storageLogger.info(`正在读取配置 ${key}`);
        
        // 使用检测到的最佳API读取值
        let value = storageAPI.getValue(key, defaultValue);
        
        // 如果是字符串，尝试解析JSON
        if (typeof value === 'string') {
            try {
                // 检查是否为JSON格式
                if ((value.startsWith('{') && value.endsWith('}')) || 
                    (value.startsWith('[') && value.endsWith(']')) ||
                    value === 'null' || value === 'true' || value === 'false' ||
                    /^\d+(\.\d+)?$/.test(value)) {
                    const parsed = JSON.parse(value);
                    storageLogger.debug(`成功将 ${key} 解析为对象`);
                    return parsed;
                }
            } catch (jsonError) {
                // 解析失败，返回原始字符串
                storageLogger.debug(`${key} 不是JSON格式，返回原始字符串`);
            }
        }
        
        storageLogger.debug(`读取完成 ${key}: ${value !== undefined ? '已找到' : '未找到，使用默认值'}`);
        return value === undefined ? defaultValue : value;
    } catch (error) {
        storageLogger.error(`读取 ${key} 失败: ${error}`);
        return defaultValue;
    }
} 