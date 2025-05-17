import { getGlobalConfig } from "../../../config";
import { loadValue } from "../../../../storage";
import { createLogger } from "../../../../logger";

const globalOptionsUtilsLogger = createLogger('global-options-utils');

/**
 * 验证配置是否成功保存
 * @returns 验证结果，true表示保存成功，false表示保存失败
 */
export function verifyConfigSaved(): boolean {
    try {
        // 验证配置是否确实被保存
        const savedConfig = loadValue("js-script-hook-config-name");
        if (savedConfig) {
            const currentConfig = getGlobalConfig();
            globalOptionsUtilsLogger.debug(`当前内存中的配置: ${JSON.stringify(currentConfig)}`);
            globalOptionsUtilsLogger.debug(`存储中的配置: ${JSON.stringify(savedConfig)}`);
            
            // 验证关键属性是否匹配
            if (savedConfig.language === currentConfig.language &&
                savedConfig.prefix === currentConfig.prefix &&
                savedConfig.hookType === currentConfig.hookType &&
                savedConfig.isIgnoreJsSuffixRequest === currentConfig.isIgnoreJsSuffixRequest &&
                savedConfig.isIgnoreNotJsonpRequest === currentConfig.isIgnoreNotJsonpRequest) {
                globalOptionsUtilsLogger.debug('验证成功: 所有配置属性匹配');
                return true;
            } else {
                globalOptionsUtilsLogger.error('验证失败: 配置不匹配');
                return false;
            }
        }
        globalOptionsUtilsLogger.error('验证失败: 无法读取保存的配置');
        return false;
    } catch (e) {
        globalOptionsUtilsLogger.error(`验证错误: ${e}`);
        return false;
    }
} 