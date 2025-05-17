import { init } from './init/init';
import { initTrustedTypesPolicy } from './utils/dom-utils';
// 现在使用原生DOM工具，替代了jQuery-lite

// 确保Trusted Types策略在最早的时机初始化
initTrustedTypesPolicy();

// 初始化应用
init(); 