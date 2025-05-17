import { Config } from "../../../config";
import { Language } from "../language";
import { getLanguage } from "../language";
import { HookType } from "./types";
import { verifyConfigSaved } from "./utils";
import { LanguageEventManager } from "../language-event";
import { createLogger } from "../../../../logger";

const globalOptionsEventsLogger = createLogger('global-options-events');

/**
 * 处理语言选择变更事件
 * @param value 选择的语言值
 * @param config 当前配置
 */
export async function handleLanguageSelect(value: string, config: Config): Promise<void> {
    if (value === 'english' || value === 'chinese') {
        config.language = value;
        config.persist();
        
        // 验证配置是否成功保存
        if (verifyConfigSaved()) {
            try {
                // 获取新的语言配置
                const newLanguage = getLanguage(value);
                
                // 通知所有组件更新语言
                await LanguageEventManager.getInstance().notifyLanguageUpdate(newLanguage);
                
                // 触发全局DOM事件，确保所有组件都能收到通知
                const event = new CustomEvent('language-changed', {
                    detail: {
                        language: newLanguage,
                        languageCode: value
                    },
                    bubbles: true
                });
                document.dispatchEvent(event);
                
                globalOptionsEventsLogger.info(`语言切换完成: ${value}`);
            } catch (error) {
                globalOptionsEventsLogger.error(`语言切换失败: ${error}`);
            }
        } else {
            globalOptionsEventsLogger.error('配置保存验证失败，不更新语言');
        }
    }
}

/**
 * 处理Hook类型选择变更事件
 * @param value 选择的Hook类型值
 * @param config 当前配置
 */
export function handleHookTypeSelect(value: string, config: Config): void {
    if (value === 'use-proxy-function' || value === 'use-redeclare-function') {
        config.hookType = value as HookType;
        config.persist();
    }
}

/**
 * 处理前缀输入变更事件
 * @param value 输入的前缀值
 * @param config 当前配置
 */
export function handlePrefixInput(value: string, config: Config): void {
    config.prefix = value;
    config.persist();
}

/**
 * 处理忽略JS后缀请求复选框变更事件
 * @param isChecked 是否选中
 * @param config 当前配置
 */
export function handleIgnoreJsSuffixCheckbox(isChecked: boolean, config: Config): void {
    config.isIgnoreJsSuffixRequest = isChecked;
    config.persist();
}

/**
 * 处理忽略非JSONP请求复选框变更事件
 * @param isChecked 是否选中
 * @param config 当前配置
 */
export function handleIgnoreNotJsonpCheckbox(isChecked: boolean, config: Config): void {
    config.isIgnoreNotJsonpRequest = isChecked;
    config.persist();
} 