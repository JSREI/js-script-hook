const {getUnsafeWindow} = require("../utils/scope-util");
const {ParamEncryptionAnalyzer} = require("./param-encryption-analyzer");

/**
 * 分析请求中的jsonp情况，主要是看一下是否存在jsonp参数，并将其识别出来
 */
class RequestAnalyzer {

    /**
     *
     * @param requestContext {RequestContext}
     */
    analyze(requestContext) {

        if (!requestContext.params) {
            return null;
        }

        // 自动推断出jsonp参数
        requestContext.params = this.computeParamsJsonpCallbackScore(requestContext.params);
        // 选出其中可能性最大的一个参数作为jsonp callback参数
        if (requestContext.params && requestContext.params.length && requestContext.params[0].jsonpCallbackScore > 0) {
            requestContext.params[0].isJsonpCallback = true;
        }

        // 推断参数加密方式
        const paramEncryptionAnalyzer = new ParamEncryptionAnalyzer();
        for (let param of requestContext.params) {
            param.encryptType = paramEncryptionAnalyzer.analyze(param);
        }

    }

    /**
     * 计算每个参数的jsonp callback的可能性的得分，并按照得分倒序排列返回
     *
     * @param params
     * @return {number}
     */
    computeParamsJsonpCallbackScore(params) {
        for (let param of params) {
            param.jsonpCallbackScore = this.computeParamJsonpCallbackScore(param);
        }
        params.sort((a, b) => b.jsonpCallbackScore - a.jsonpCallbackScore);
        return params;
    }

    /**
     *
     * 计算单个参数的得分
     *
     * @param param {Param}
     * @return {number}
     */
    computeParamJsonpCallbackScore(param) {

        // 是否存在对应的全局的函数类型，不存在的话肯定也不是jsonp的callback
        const unsafeWindow = getUnsafeWindow();
        if (typeof unsafeWindow[param.value] !== "function") {
            // 如果都没有对应的全局函数存在的话，则直接判定为0分
            return 0;
        }
        let jsonpScore = 100;

        // TODO 2024-12-22 01:32:28 如果是名称完全等于callback和包含callback，得到的分值是不是不应该一样？
        // 判断参数中的jsonp参数特征，参数名
        const paramName = param.name.toLowerCase();
        if (paramName.indexOf("callback") !== -1) {
            jsonpScore += 10;
        }

        // 参数值，寻找时间戳特征
        const match = new RegExp(/(\d{13}|\d{10})/).exec(param.value);
        if (match && this.isValidJsonpTimestamp(match[0])) {
            jsonpScore += 50;
        }

        return jsonpScore;
    }

    /**
     * 判断时间戳是否是合法的jsonp时间戳，它的时间范围不应该太过于离谱，应该是一个近期的时间
     *
     * @param timestampString
     * @return {boolean}
     */
    isValidJsonpTimestamp(timestampString) {
        if (!timestampString) {
            return false;
        }
        let timestamp = parseInt(timestampString);
        if (timestampString.length === 10) {
            timestamp *= 1000;
        }
        // 判断时间戳的范围是否合法，这个时间戳应该是当前时间的前后24小时浮动（考虑到时区之类的问题简单起见）
        const max = new Date().getTime() + 1000 * 60 * 60 * 24;
        const min = new Date().getTime() - 1000 * 60 * 60 * 24;
        return timestamp >= min && timestamp <= max;
    }

}

module.exports = {
    RequestAnalyzer
}


