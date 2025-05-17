/**
 * jQuery扩展兼容层
 * 
 * 这个文件是为了保持向后兼容性，将jQuery-lite库的功能重新导出
 */

import $, { $safe, JQueryLite } from './index';
import { createLogger } from '../logger';

// 创建jQuery-ext专用的日志记录器
const logger = createLogger('jquery-ext');

/**
 * 初始化jQuery安全扩展
 * 为了向后兼容，保留这个函数，但它现在不需要做任何事情
 */
export function initJQuerySafeExtensions(): void {
  // jQuery-lite已经内置了安全扩展，不需要额外初始化
  logger.info('jQuery安全扩展已初始化');
}

// 重新导出jQuery-lite的功能
export { $, $safe, JQueryLite }; 