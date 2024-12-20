/**
 * 支持的相关配置
 */
class Config {

    /**
     *
     * @param urlPattern {String | RegExp} 用于与script类型的请求的URL做匹配进入断点
     * @param callbackFunctionParamName {String} 传递jsonp回调函数名字的参数，比如 "callback"
     */
    constructor(urlPattern, callbackFunctionParamName) {
        // 让用户能够自己指定前缀，也许会有一些拥有感？之前ast hook好像就有个哥们喜欢这样干...
        this.prefix = "CC11001100";
    }

}

const globalConfig = new Config();

module.exports = {
    Config,
    globalConfig
}
