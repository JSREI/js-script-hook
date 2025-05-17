import { Language } from '../language';

/**
 * 语言可更新接口
 * 实现此接口的组件可以响应语言更新事件
 */
export interface LanguageUpdateable {
    /**
     * 更新组件的语言
     * @param language 新的语言配置
     */
    updateLanguage(language: Language): void;
    
    /**
     * 获取组件的唯一标识
     */
    getComponentId(): string;

    /**
     * 组件销毁时的清理工作
     * 主要用于取消语言更新事件的订阅
     */
    destroy(): void;
} 