/**
 * 表示一个 JSONP 的条件断点，用于在请求或响应处理时中断执行。
 */
class Debugger {

    /**
     * 构造函数，创建一个 Debugger 实例。
     *
     * @param {string} id - 断点的唯一标识。
     * @param {boolean} enable - 此断点是否处于启用状态。
     * @param {string} urlPatternType - URL 匹配模式类型（例如：字符串或正则表达式）。
     * @param {string | RegExp} urlPattern - 用于与 script 类型请求的 URL 做匹配，只有这个是必须指定的。
     * @param {boolean} [enableRequestDebugger=true] - 是否开启请求断点。开启后会在请求发送之前进入断点。如果不指定，默认开启。
     * @param {boolean} [enableResponseDebugger=true] - 是否开启响应断点。开启后会在响应处理之前进入断点。如果不指定，默认开启。
     * @param {string | null} [callbackFunctionParamName=null] - 传递 JSONP 回调函数名称的参数（例如："callback"）。如果不指定，会自动推测。
     * @param {string | null} [comment=null] - 断点的注释或描述信息。
     */
    constructor(
        id,
        enable,
        urlPatternType,
        urlPattern,
        enableRequestDebugger = true,
        enableResponseDebugger = true,
        callbackFunctionParamName = null,
        comment = null
    ) {
        this.createTime = new Date().getTime();
        this.updateTime = new Date().getTime();
        this.id = id;
        this.enable = enable;
        this.urlPatternType = urlPatternType;
        this.urlPattern = urlPattern;
        this.enableRequestDebugger = enableRequestDebugger;
        this.enableResponseDebugger = enableResponseDebugger;
        this.callbackFunctionParamName = callbackFunctionParamName;
        this.comment = comment;
    }

}

module.exports = {
    Debugger
};