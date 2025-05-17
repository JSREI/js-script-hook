import { init } from './init/init';
import { initTrustedTypesPolicy } from './jQuery-lite';
// jQuery-lite 库已经内置了 Trusted Types 支持，不需要单独初始化

// 确保Trusted Types策略在最早的时机初始化
initTrustedTypesPolicy();

// 初始化应用
init(); 