import { ScriptContext } from '../context/script/script-context';
import { ResponseContext } from '../context/response/response-context';

/**
 * 用于解析jsonp响应
 */
export class ResponseAnalyzer {
    // TODO 2025-01-07 21:44:27 似乎并不需要这部分逻辑了，仅从请求参数进行推测就已经足够用了

    /**
     * 从一次完整的请求中分析
     * @param scriptContext - 脚本上下文
     */
    public parseScriptContext(scriptContext: ScriptContext): void {
        if (!scriptContext.responseContext || !scriptContext.requestContext) {
            return;
        }

        const responseFunctionNameSymbolSet = this.extractResponseFunctionNameSymbol(scriptContext.responseContext);
        const jsonpCallbackFuncName = scriptContext.requestContext.getJsonpCallbackFuncName();
        if (jsonpCallbackFuncName && !responseFunctionNameSymbolSet.has(jsonpCallbackFuncName)) {
            // TODO 2025-01-08 00:59:45 完犊子了，发现了异常情况
        }

        // TODO 2024-12-20 01:52:49
        // 第一次，识别出了参数交什么名字，然后把它记录下来，第二次的时候读取之前保存的结果，自动对callback函数增加hook
        // 当被调用的时候

        // 判断是否是jsonp

        // 1. 如果请求和响应都有，则尝试对照请求和响应来识别

        // 1. 是jsonp类型的地址

        // 2. 分析参数，判断哪个参数是最有可能是jsonp回调的函数名称

        // 3. 同时结合响应进行判断（比如某个参数在响应中出现过）

        // 某个参数的历史值很相似，比如有相同的前缀和后缀

        // 匹配常见的框架的发送jsonp的形式
    }

    /**
     * 从响应中提取出所有的函数名
     * @param responseContext - 响应上下文
     * @returns 返回包含所有函数名的 Set
     */
    private extractResponseFunctionNameSymbol(responseContext: ResponseContext): Set<string> {
        // 响应示例：jsonpCallback({"foo":"blablabla","bar":0.5853678323239795})
        const responseFunctionNameSymbolSet = new Set<string>();
        const regex = /(\w+)\s*:\s*/g;
        let match;
        while ((match = regex.exec(responseContext.responseJsCode)) !== null) {
            responseFunctionNameSymbolSet.add(match[1]);
        }
        return responseFunctionNameSymbolSet;
    }
} 