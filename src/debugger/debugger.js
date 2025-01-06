const {ObjectFunctionHook} = require("../hook/object-function-hook");
const {getUnsafeWindow} = require("../utils/scope-util");
const {getGlobalConfig} = require("../config/config");

/**
 * 表示一个jsonp的条件断点
 */
class Debugger {

    /**
     * 创建一个断点
     *
     * @param id {string} 断点的唯一标识
     * @param enable {Boolean} 此断点是否处于启用状态
     * @param urlPatternType {String}
     * @param urlPattern {String | RegExp} 用于与script类型的请求的URL做匹配进入断点，只有这一个是必须指定的
     * @param enableRequestDebugger {Boolean | null} 是否开启请求断点，开启请求断点会在请求发送之前进入断点，不指定的话默认开启
     * @param enableResponseDebugger {Boolean | null} 是否开启响应断点，开启响应断点会在响应处理之前进入断点，不指定的话默认开启
     * @param callbackFunctionParamName {String | null} 传递jsonp回调函数名字的参数，比如 "callback"，如果不指定的话会自动推测
     * @param comment
     */
    constructor(id, enable,
                urlPatternType,
                urlPattern,
                enableRequestDebugger = true,
                enableResponseDebugger = true,
                callbackFunctionParamName,
                comment) {
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
}
