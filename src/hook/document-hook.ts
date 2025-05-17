import { ScriptHook } from "./script-hook";
import { createLogger } from "../logger";

// 创建钩子模块专用的日志记录器
const hookLogger = createLogger('document-hook');

/**
 * 用于为document添加hook
 */
export class DocumentHook {
    private readonly document: Document;
    private readonly documentCreateHolder: typeof Document.prototype.createElement;

    /**
     * @param document - 要添加 hook 的 document 对象
     */
    constructor(document: Document) {
        this.document = document;
        this.documentCreateHolder = document.createElement;
    }

    /**
     * 添加 hook
     */
    public addHook(): void {
        const _this = this;
        
        hookLogger.debug('正在为document.createElement添加钩子');

        this.document.createElement = function (this: Document, tagName: string, options?: ElementCreationOptions): HTMLElement {
            const result = _this.documentCreateHolder.apply(this, [tagName, options]);
            if (tagName.toLowerCase() === "script") {
                try {
                    hookLogger.debug('检测到script元素创建，添加脚本钩子');
                    new ScriptHook(result as HTMLScriptElement).addHook();
                } catch (e) {
                    hookLogger.error(`为脚本元素添加钩子时出错: ${e}`);
                }
            }
            return result;
        };

        this.document.createElement.toString = function (): string {
            return _this.documentCreateHolder.toString();
        };
        
        hookLogger.info('document.createElement钩子添加完成');
    }
} 