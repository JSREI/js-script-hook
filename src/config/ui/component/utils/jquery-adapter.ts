/**
 * JQuery到JQueryLite的适配器
 * 
 * 这个文件提供了一个适配层，使现有代码能够继续使用JQuery类型，但全部使用我们自己的jQuery-lite实现
 */

import $lite from '../../../../jQuery-lite/index';
import { createLogger } from '../../../../logger';
import type { JQuery } from './jquery-adapter.d';

const jqueryLogger = createLogger('jquery-adapter');

/**
 * 转换jQuery-lite对象为我们的JQuery对象
 * 
 * @param jqLite jQuery-lite对象
 * @returns JQuery对象
 */
function convertToJQueryObject(jqLite: any): JQuery {
  try {
    // jQuery-lite对象本身应该已经符合JQuery接口
    return jqLite as JQuery;
  } catch (e) {
    jqueryLogger.error(`转换jQuery-lite对象失败: ${e}`);
  }
  return jqLite;
}

/**
 * jQuery适配器 - 始终使用我们自己的jQuery-lite
 * 
 * @param selector 选择器
 * @returns JQuery对象
 */
function $(selector: string | Element | Element[] | Document): JQuery {
  jqueryLogger.debug(`jQuery适配器调用，选择器类型：${typeof selector}`);
  return convertToJQueryObject($lite(selector));
}

/**
 * jQuery函数 - 确保作为函数使用时的兼容性
 * 
 * @param selector 选择器
 * @returns JQuery对象
 */
function jQuery(selector: string | Element | Element[] | Document): JQuery {
  jqueryLogger.debug(`jQuery函数调用，选择器类型：${typeof selector}`);
  return $(selector);
}

// 导出函数
export { $, jQuery };
export default $; 