import { getUnsafeWindow } from '../utils/scope-util';
import { ParamEncryptionAnalyzer } from './param-encryption-analyzer';
import { RequestContext } from '../context/request/request-context';
import { Param } from '../context/request/param';

interface UnsafeWindow extends Window {
    [key: string]: any;
}

/**
 * 分析请求中的jsonp情况，主要是看一下是否存在jsonp参数，并将其识别出来
 */
export class RequestAnalyzer {
    /**
     * 分析请求上下文
     * @param requestContext - 请求上下文对象
     */
    public analyze(requestContext: RequestContext): void {
        if (!requestContext.params) {
            return;
        }

        // 自动推断出jsonp参数
        const analyzedParams = this.computeParamsJsonpCallbackScore(requestContext.params);
        // 选出其中可能性最大的一个参数作为jsonp callback参数
        if (analyzedParams.length && analyzedParams[0].jsonpCallbackScore > 0) {
            analyzedParams[0].isJsonpCallback = true;
        }

        // 推断参数加密方式
        const paramEncryptionAnalyzer = new ParamEncryptionAnalyzer();
        for (const param of analyzedParams) {
            param.encryptType = paramEncryptionAnalyzer.analyze(param);
        }
    }

    /**
     * 计算每个参数的jsonp callback的可能性的得分，并按照得分倒序排列返回
     *
     * @param params - 参数列表
     * @returns 按得分排序后的参数列表
     */
    private computeParamsJsonpCallbackScore(params: Param[]): Param[] {
        const scoredParams = [...params];
        for (const param of scoredParams) {
            param.jsonpCallbackScore = this.computeParamJsonpCallbackScore(param);
        }
        scoredParams.sort((a, b) => b.jsonpCallbackScore - a.jsonpCallbackScore);
        return scoredParams;
    }

    /**
     * 计算单个参数的得分
     *
     * @param param - 要计算得分的参数
     * @returns 参数的得分
     */
    private computeParamJsonpCallbackScore(param: Param): number {
        // 是否存在对应的全局的函数类型，不存在的话肯定也不是jsonp的callback
        const unsafeWindow = getUnsafeWindow() as UnsafeWindow;
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
     * @param timestampString - 时间戳字符串
     * @returns 是否是有效的JSONP时间戳
     */
    private isValidJsonpTimestamp(timestampString: string): boolean {
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