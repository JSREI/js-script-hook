const {Param} = require("./param");
const {repeat} = require("../../utils/string-util");

/**
 * 用于封装请求的上下文
 */
class RequestContext {

    /**
     * 一个请求上下文是从一个script的src的url中解析出来的
     *
     * @param rawUrl {String} 要请求的URL的地址，到锚点这一层的
     * @param hostname {String}
     * @param host {String}
     * @param port {Number}
     * @param path {String}
     * @param params {Array<Param>}
     * @param hash {String}
     */
    constructor(rawUrl, hostname, host, port, path, params, hash) {
        this.rawUrl = rawUrl;
        this.hostname = hostname;
        this.host = host;
        this.port = port;
        this.path = path;
        // 避免为空
        this.params = params || [];
        this.hash = hash;
    }

    /**
     * 从URL解析请求上下文
     *
     * @param requestUrl {String} 要被解析的URL
     * @return {RequestContext} 返回解析好的请求上下文
     */
    static parseRequestContext(requestUrl) {

        const url = new URL(requestUrl);

        // 解析URL上的参数
        const params = [];
        url.searchParams.forEach(function (value, key) {
            const param = new Param(key, value);
            params.push(param);
        });

        const port = parseInt(url.port);
        const host = url.host;
        const hostname = url.hostname;
        const path = url.pathname;
        const hash = url.hash;

        return new RequestContext(requestUrl, hostname, host, port, path, params, hash);
    }

    /**
     * 根据参数名获取参数
     *
     * @param paramName
     * @return {Param|null}
     */
    getParam(paramName) {
        for (let param of this.params) {
            if (param.name === paramName) {
                return param;
            }
        }
        return null;
    }

    /**
     * 根据参数名获取参数值
     *
     * @param paramName
     * @return {*|null}
     */
    getParamValueByName(paramName) {
        const param = this.getParam(paramName);
        if (param) {
            return param.value;
        } else {
            return null;
        }
    }

    /**
     * 此请求是否是JSONP类型的请求
     *
     * @return {boolean}
     */
    isJsonpRequest() {
        if (!this.params) {
            return false;
        }
        for (let p of this.params) {
            if (p.isJsonpCallback) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取JsonP类型的请求的回调函数的名字
     *
     * @return {String}
     */
    getJsonpCallbackFuncName() {
        if (!this.params) {
            return null;
        }
        for (let p of this.params) {
            if (p.isJsonpCallback) {
                return p.value;
            }
        }
        return null;
    }

    /**
     *
     * @return {""|boolean}
     */
    isJsSuffixRequest() {
        return this.path && this.path.toLowerCase().endsWith(".js")
    }

    /**
     * 转成方便阅读的格式
     */
    toHumanReadable(indent) {

        const indentSpace = repeat(" ", indent);

        const msgs = [];
        msgs.push(`${indentSpace}hostname: ${this.hostname}`);
        msgs.push(`${indentSpace}path: ${this.path}`);

        let paramTitle = `${indentSpace}params(${this.params.length}): `;
        if (!this.params.length) {
            paramTitle += " do not have param.";
        }
        msgs.push(paramTitle);
        for (let param of this.params) {
            msgs.push(param.toHumanReadable(indent + 4));
        }


        if (this.hash) {
            msgs.push(`${indentSpace}hash: ${this.hash}`)
        }

        return msgs.join("\n\n");
    }

}

module.exports = {
    RequestContext
}

