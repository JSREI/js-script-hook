import { Language } from '../language';
import { createLogger } from '../../../../logger';

// 创建语言事件管理器专用的日志记录器
const languageEventLogger = createLogger('language-event');

// 语言更新回调函数类型
export type LanguageUpdateCallback = (language: Language) => void;

/**
 * 语言更新事件管理器
 * 实现观察者模式，管理语言更新事件的订阅和触发
 */
export class LanguageEventManager {
    private static instance: LanguageEventManager;
    private observers: Map<string, LanguageUpdateCallback>;
    private currentLanguage: Language | null;

    private constructor() {
        this.observers = new Map();
        this.currentLanguage = null;
    }

    /**
     * 获取单例实例
     */
    public static getInstance(): LanguageEventManager {
        if (!LanguageEventManager.instance) {
            LanguageEventManager.instance = new LanguageEventManager();
        }
        return LanguageEventManager.instance;
    }

    /**
     * 订阅语言更新事件
     * @param componentId 组件唯一标识
     * @param callback 更新回调函数
     */
    public subscribe(componentId: string, callback: LanguageUpdateCallback): void {
        languageEventLogger.debug(`组件 ${componentId} 订阅语言更新事件`);
        this.observers.set(componentId, callback);
        
        // 如果已有当前语言，立即触发一次回调
        if (this.currentLanguage) {
            languageEventLogger.debug(`立即使用当前语言更新组件 ${componentId}`);
            callback(this.currentLanguage);
        }
    }

    /**
     * 取消订阅语言更新事件
     * @param componentId 组件唯一标识
     */
    public unsubscribe(componentId: string): void {
        languageEventLogger.debug(`组件 ${componentId} 取消订阅语言更新事件`);
        this.observers.delete(componentId);
    }

    /**
     * 触发语言更新事件
     * @param language 新的语言配置
     * @returns Promise<void> 所有组件更新完成的 Promise
     */
    public notifyLanguageUpdate(language: Language): Promise<void> {
        languageEventLogger.info('触发语言更新事件');
        this.currentLanguage = language;
        
        // 记录更新前的观察者数量
        const observerCount = this.observers.size;
        languageEventLogger.debug(`开始通知 ${observerCount} 个观察者`);
        
        // 使用 Promise.all 并行处理所有更新
        const updatePromises = Array.from(this.observers.entries()).map(([componentId, callback]) => {
            return new Promise<void>((resolve) => {
                try {
                    callback(language);
                    languageEventLogger.debug(`组件 ${componentId} 更新成功`);
                } catch (error) {
                    languageEventLogger.error(`组件 ${componentId} 更新失败: ${error}`);
                } finally {
                    resolve();
                }
            });
        });

        // 等待所有更新完成
        return Promise.all(updatePromises).then(() => {
            languageEventLogger.info('所有组件更新完成');
        });
    }

    /**
     * 获取当前语言配置
     */
    public getCurrentLanguage(): Language | null {
        return this.currentLanguage;
    }

    /**
     * 获取观察者数量
     */
    public getObserverCount(): number {
        return this.observers.size;
    }
} 