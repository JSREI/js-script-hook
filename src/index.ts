import { init } from './init/init';
import { initJQuerySafeExtensions } from './jQuery-lite/jquery-ext';
import { initTrustedTypesPolicy } from './jQuery-lite/dom';
// jQuery-lite 库已经内置了 Trusted Types 支持，不需要单独初始化

// 确保Trusted Types策略在最早的时机初始化
initTrustedTypesPolicy();

// 然后初始化jQuery安全扩展
initJQuerySafeExtensions();

// 最后初始化应用
init(); 