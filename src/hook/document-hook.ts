import { ScriptHook } from "./script-hook";

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

        this.document.createElement = function (this: Document, tagName: string, options?: ElementCreationOptions): HTMLElement {
            const result = _this.documentCreateHolder.apply(this, [tagName, options]);
            if (tagName.toLowerCase() === "script") {
                try {
                    new ScriptHook(result as HTMLScriptElement).addHook();
                } catch (e) {
                    console.error(e);
                }
            }
            return result;
        };

        this.document.createElement.toString = function (): string {
            return _this.documentCreateHolder.toString();
        };
    }
} 