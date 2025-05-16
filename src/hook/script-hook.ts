import { ScriptContext } from '../context/script/script-context';
import { RequestContext } from '../context/request/request-context';
import { RequestAnalyzer } from '../analyzer/request-analyzer';
import { getGlobalConfig } from '../config/config';
import { RequestFormatter } from '../formatter/request-formatter';
import { JsonpCallbackHook } from './jsonp-callback-hook';
import { formatScriptSrcToUrl } from '../utils/url-util';
import { DebuggerTester } from '../debugger/debugger-tester';

/**
 * 用于给script添加Hook
 */
export class ScriptHook {
    private readonly script: HTMLScriptElement;

    /**
     * @param script - 要添加 hook 的 script 元素
     */
    constructor(script: HTMLScriptElement) {
        this.script = script;
    }

    /**
     * 添加 hook
     */
    public addHook(): void {
        const _this = this;
        // 在设置src时拦截，然后就可以去追溯src是怎么来的了
        let srcHolder: string | null = null;
        Object.defineProperty(this.script, "src", {
            get: function (): string | null {
                return srcHolder;
            },
            set: function (newSrc: string): void {
                // 尽量不要影响页面原有的流程
                try {
                    const formattedScriptSrc = formatScriptSrcToUrl(newSrc);
                    // 初始化请求上下文
                    const requestContext = RequestContext.parseRequestContext(formattedScriptSrc);
                    const scriptContext = new ScriptContext(formattedScriptSrc, requestContext, null);

                    const requestAnalyzer = new RequestAnalyzer();
                    requestAnalyzer.analyze(requestContext);

                    // 在请求发送之前测试断点
                    if (new DebuggerTester().isNeedPrintToConsole(getGlobalConfig(), scriptContext)) {
                        const requestFormatter = new RequestFormatter();
                        requestFormatter.format(scriptContext);
                    }

                    const hitDebuggers = getGlobalConfig().testAll(scriptContext);
                    new JsonpCallbackHook(scriptContext, hitDebuggers).addHook();
                } catch (e) {
                    console.error(e);
                }

                // 这里认为script不会被复用，所以添加的hook在设置src的时候就会被删除掉，会有script复用的情况吗？
                delete (_this.script as any).src;
                srcHolder = _this.script.src = newSrc;
            },
            configurable: true
        });
    }
} 