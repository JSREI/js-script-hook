import { init } from './init/init';
import { initJQuerySafeExtensions } from './jQuery-lite/jquery-ext';
// jQuery-lite 库已经内置了 Trusted Types 支持，不需要单独初始化

// 立即初始化jQuery安全扩展，确保在其他代码执行前运行
initJQuerySafeExtensions();

(async (): Promise<void> => {
    init();
})(); 