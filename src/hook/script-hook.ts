import { ScriptContext } from '../context/script/script-context';
import { RequestContext } from '../context/request/request-context';
import { RequestAnalyzer } from '../analyzer/request-analyzer';
import { getGlobalConfig } from '../config/config';
import { RequestFormatter } from '../formatter/request-formatter';
import { JsonpCallbackHook } from './jsonp-callback-hook';
import { formatScriptSrcToUrl } from '../utils/url-util';
import { DebuggerTester } from '../debugger/debugger-tester';
import { createLogger } from '../logger';

// 创建脚本钩子专用的日志记录器
const scriptHookLogger = createLogger('script-hook');

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
        
        scriptHookLogger.debug('为script元素添加src属性钩子');
        
        Object.defineProperty(this.script, "src", {
            get: function (): string | null {
                return srcHolder;
            },
            set: function (newSrc: string): void {
                // 尽量不要影响页面原有的流程
                try {
                    const formattedScriptSrc = formatScriptSrcToUrl(newSrc);
                    scriptHookLogger.debug(`检测到脚本src设置: ${formattedScriptSrc}`);
                    
                    // 初始化请求上下文
                    const requestContext = RequestContext.parseRequestContext(formattedScriptSrc);
                    const scriptContext = new ScriptContext(formattedScriptSrc, requestContext, null);

                    const requestAnalyzer = new RequestAnalyzer();
                    requestAnalyzer.analyze(requestContext);

                    // 在请求发送之前测试断点
                    if (new DebuggerTester().isNeedPrintToConsole(getGlobalConfig(), scriptContext)) {
                        scriptHookLogger.info(`脚本请求匹配调试规则，将输出到控制台: ${formattedScriptSrc}`);
                        const requestFormatter = new RequestFormatter();
                        requestFormatter.format(scriptContext);
                    }

                    const hitDebuggers = getGlobalConfig().testAll(scriptContext);
                    if (hitDebuggers.length > 0) {
                        scriptHookLogger.info(`脚本请求命中${hitDebuggers.length}个断点规则`);
                    }
                    new JsonpCallbackHook(scriptContext, hitDebuggers).addHook();
                } catch (e) {
                    scriptHookLogger.error(`处理脚本src时出错: ${e}`);
                }

                // 这里认为script不会被复用，所以添加的hook在设置src的时候就会被删除掉，会有script复用的情况吗？
                delete (_this.script as any).src;
                srcHolder = _this.script.src = newSrc;
                scriptHookLogger.debug('脚本src设置完成');
            },
            configurable: true
        });
        
        scriptHookLogger.debug('script元素钩子添加完成');
    }
} 