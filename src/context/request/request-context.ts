import { repeat } from '../../utils/string-util';
import { Param } from './param';

/**
 * 用于封装请求的上下文，包含从 URL 中解析出的各种信息。
 */
export class RequestContext {
    public readonly rawUrl: string;
    public readonly hostname: string;
    public readonly host: string;
    public readonly port: number;
    public readonly path: string;
    public readonly params: Param[];
    public readonly hash: string;

    /**
     * 构造函数，创建一个 RequestContext 实例。
     *
     * @param {string} rawUrl - 原始的 URL 地址，包含锚点部分。
     * @param {string} hostname - 主机名（例如：example.com）。
     * @param {string} host - 主机（包含端口号，例如：example.com:8080）。
     * @param {number} port - 端口号。
     * @param {string} path - URL 路径部分（例如：/path/to/resource）。
     * @param {Array<Param>} params - URL 中的查询参数列表。
     * @param {string} hash - URL 中的锚点部分（例如：#section1）。
     */
    constructor(rawUrl: string, hostname: string, host: string, port: number, path: string, params: Param[], hash: string) {
        this.rawUrl = rawUrl;
        this.hostname = hostname;
        this.host = host;
        this.port = port;
        this.path = path;
        // 避免 params 为空，初始化为空数组
        this.params = params || [];
        this.hash = hash;
    }

    /**
     * 从 URL 解析请求上下文。
     *
     * @param {string} requestUrl - 要被解析的 URL。
     * @return {RequestContext} - 返回解析好的请求上下文。
     */
    public static parseRequestContext(requestUrl: string): RequestContext {
        const url = new URL(requestUrl);

        // 解析 URL 上的参数
        const params: Param[] = [];
        url.searchParams.forEach((value, key) => {
            const param = new Param(key, value, false);
            params.push(param);
        });

        const port = parseInt(url.port || '80');
        const host = url.host;
        const hostname = url.hostname;
        const path = url.pathname;
        const hash = url.hash;

        return new RequestContext(requestUrl, hostname, host, port, path, params, hash);
    }

    /**
     * 根据参数名获取参数对象。
     *
     * @param {string} paramName - 要查找的参数名。
     * @return {Param|null} - 返回找到的参数对象，如果未找到则返回 null。
     */
    public getParam(paramName: string): Param | null {
        for (const param of this.params) {
            if (param.name === paramName) {
                return param;
            }
        }
        return null;
    }

    /**
     * 根据参数名获取参数值。
     *
     * @param {string} paramName - 要查找的参数名。
     * @return {string|null} - 返回参数的值，如果未找到则返回 null。
     */
    public getParamValueByName(paramName: string): string | null {
        const param = this.getParam(paramName);
        if (param) {
            return param.value;
        } else {
            return null;
        }
    }

    /**
     * 判断此请求是否是 JSONP 类型的请求。
     *
     * @return {boolean} - 如果是 JSONP 请求则返回 true，否则返回 false。
     */
    public isJsonpRequest(): boolean {
        if (!this.params) {
            return false;
        }
        for (const p of this.params) {
            if (p.isJsonpCallback) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取 JSONP 请求的回调函数名称。
     *
     * @return {string|null} - 返回 JSONP 回调函数的名称，如果未找到则返回 null。
     */
    public getJsonpCallbackFuncName(): string | null {
        if (!this.params) {
            return null;
        }
        for (const p of this.params) {
            if (p.isJsonpCallback) {
                return p.value;
            }
        }
        return null;
    }

    /**
     * 判断此请求是否是 .js 后缀的请求。
     *
     * @return {boolean} - 如果路径以 .js 结尾则返回 true，否则返回 false。
     */
    public isJsSuffixRequest(): boolean {
        return this.path ? this.path.toLowerCase().endsWith(".js") : false;
    }

    /**
     * 将请求上下文转换为方便人类阅读的格式。
     *
     * @param {number} indent - 缩进空格数，用于格式化输出。
     * @return {string} - 返回格式化后的字符串。
     */
    public toHumanReadable(indent: number): string {
        const indentSpace = repeat(" ", indent);

        const msgs: string[] = [];
        msgs.push(`${indentSpace}hostname: ${this.hostname}`);
        msgs.push(`${indentSpace}path: ${this.path}`);

        let paramTitle = `${indentSpace}params(${this.params.length}): `;
        if (!this.params.length) {
            paramTitle += " do not have param.";
        }
        msgs.push(paramTitle);
        for (const param of this.params) {
            msgs.push(param.toHumanReadable(indent + 4));
        }

        if (this.hash) {
            msgs.push(`${indentSpace}hash: ${this.hash}`);
        }

        return msgs.join("\n");
    }
} 