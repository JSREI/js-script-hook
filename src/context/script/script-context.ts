import { randomId } from "../../utils/id-util";
import { RequestContext } from "../request/request-context";
import { ResponseContext } from "../response/response-context";

/**
 * 封装一次 Script 请求的上下文，包含请求和响应的相关信息。
 */
export class ScriptContext {
    public readonly requestId: string;
    public readonly url: string;
    public readonly requestContext: RequestContext | null;
    public readonly responseContext: ResponseContext | null;

    /**
     * 构造函数，创建一个 ScriptContext 实例。
     *
     * @param url - 请求的 URL。
     * @param requestContext - 请求上下文，包含请求的详细信息。
     * @param responseContext - 响应上下文，包含响应的详细信息。
     */
    constructor(url: string, requestContext: RequestContext | null, responseContext: ResponseContext | null) {
        // 生成唯一的请求 ID
        this.requestId = "js-script-hook-" + randomId();
        this.url = url;
        this.requestContext = requestContext;
        this.responseContext = responseContext;
    }

    /**
     * 判断此请求是否是 JSONP 请求。
     *
     * @returns 如果是 JSONP 请求则返回 true，否则返回 false。
     */
    public isJsonp(): boolean {
        if (this.requestContext && this.requestContext.isJsonpRequest()) {
            return true;
        }
        if (this.responseContext && this.responseContext.isJsonpResponse()) {
            return true;
        }
        return false;
    }

    /**
     * 判断此请求是否是 .js 文件请求。
     *
     * @returns 如果请求的路径以 .js 结尾则返回 true，否则返回 false。
     */
    public isJsSuffixRequest(): boolean {
        return this.requestContext ? this.requestContext.isJsSuffixRequest() : false;
    }

    /**
     * 将 Script 上下文转换为方便人类阅读的格式。
     *
     * @returns 返回格式化后的字符串。
     */
    public toHumanReadable(): string {
        const msgs: string[] = [];

        if (this.requestContext) {
            msgs.push("Request Information: ");
            msgs.push(this.requestContext.toHumanReadable(4));
        }

        msgs.push("\n\n");

        if (this.responseContext) {
            msgs.push("Response Information: ");
            msgs.push(this.responseContext.toHumanReadable());
        }

        return msgs.join("\n\n");
    }
} 