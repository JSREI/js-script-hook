/**
 * 语言模块索引文件
 * 导出语言相关类型、语言包和获取语言的工具函数
 */
import { getGlobalConfig } from "../../../config";
import { Language, LanguageType } from './types';
import { chinese } from './zh';
import { english } from './en';

/**
 * 根据全局配置获取语言设置
 * @returns 返回当前语言的配置对象
 */
export function getLanguageByGlobalConfig(): Language {
    return getLanguage(getGlobalConfig().language);
}

/**
 * 根据指定的语言获取对应的语言配置
 * @param language - 语言类型（"chinese" 或 "english"）
 * @returns 返回指定语言的配置对象
 */
export function getLanguage(language: string): Language {
    switch (language) {
        case "chinese":
            return chinese;
        case "english":
            return english;
        default:
            return english;
    }
}

// 导出类型和语言包
export type { Language, LanguageType };
export { chinese, english }; 