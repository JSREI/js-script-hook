import { repeat } from '../../utils/string-util';

/**
 * 表示 URL 路径中的一个参数。对于 script 类型的请求来说，它只有 query string 类型的参数，因为它无法携带请求体。
 */
export class Param {
    public readonly name: string;
    public readonly value: string;
    public isJsonpCallback: boolean;
    public jsonpCallbackScore: number;
    public encryptType: string | null;

    /**
     * 构造函数，创建一个 Param 实例。
     *
     * @param name - 参数的名字。
     * @param value - 参数的值。
     * @param isJsonpCallback - 此参数是否是 JSONP 的回调函数名称。注意：有可能会识别不准。
     */
    constructor(name: string, value: string, isJsonpCallback: boolean = false) {
        // 参数名和值
        this.name = name;
        this.value = value;

        // 这个参数是否是 JSONP 的回调函数
        this.isJsonpCallback = isJsonpCallback;

        // 此参数是 JSONP 的 callback 参数的可能性有多大（用于评分）
        this.jsonpCallbackScore = 0;

        // 参数的加密类型
        this.encryptType = null;
    }

    /**
     * 将参数转换为适合人类阅读的格式。
     *
     * @param indent - 缩进空格数，用于格式化输出。
     * @returns 返回格式化后的参数字符串。
     */
    public toHumanReadable(indent: number): string {
        const indentString = repeat(" ", indent);
        if (this.isJsonpCallback) {
            return `${indentString}${this.name} = ${this.value}    <---- this param is jsonp callback function name`;
        } else {
            return `${indentString}${this.name} = ${this.value}`;
        }
    }
} 