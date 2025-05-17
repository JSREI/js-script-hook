/**
 * JQuery到JQueryLite的适配器
 * 
 * 这个文件提供了一个适配层，使现有代码能够继续使用JQuery类型，但全部使用自己的jQuery-lite实现
 */

import $lite, { JQueryLite } from '../../../../jQuery-lite/index';
import { createLogger } from '../../../../logger';

const jqueryLogger = createLogger('jquery-adapter');

// TypeOrArray类型定义，兼容jQuery的选择器用法
export type TypeOrArray<T> = T | Array<T>;

// HTMLElementOrString类型定义
export type HTMLElementOrString = HTMLElement | string;

/**
 * JQuery封装
 */
interface JQueryObject {
  length: number;
  [index: number]: HTMLElement;
  each: (callback: (index: number, element: HTMLElement) => void) => JQueryObject;
  addClass: (className: string) => JQueryObject;
  removeClass: (className: string) => JQueryObject;
  toggleClass: (className: string) => JQueryObject;
  attr: (name: string, value?: string) => string | JQueryObject;
  prop: (name: string, value?: boolean) => boolean | JQueryObject;
  css: (name: string | Record<string, string>, value?: string) => string | JQueryObject;
  html: (htmlString?: string) => string | JQueryObject;
  text: (text?: string) => string | JQueryObject;
  append: (content: string | HTMLElement | JQueryObject) => JQueryObject;
  appendTo: (target: string | HTMLElement | JQueryObject) => JQueryObject;
  remove: () => JQueryObject;
  on: (eventName: string, handler: EventListener) => JQueryObject;
  off: (eventName: string, handler?: EventListener) => JQueryObject;
  show: () => JQueryObject;
  hide: () => JQueryObject;
  toggle: () => JQueryObject;
  val: (value?: string) => string | JQueryObject;
  find: (selector: string) => JQueryObject;
  filter: (selector: string) => JQueryObject;
  parent: () => JQueryObject;
  parents: (selector?: string) => JQueryObject;
  children: (selector?: string) => JQueryObject;
  first: () => JQueryObject;
  last: () => JQueryObject;
  eq: (index: number) => JQueryObject;
}

/**
 * 增强jQuery类型
 */
export interface JQuery<TElement = HTMLElement> extends JQueryObject {}

/**
 * 转换jQuery-lite对象为我们的JQueryObject
 * 
 * @param jqLite jQuery-lite对象
 * @returns JQueryObject
 */
function convertToJQueryObject(jqLite: any): JQuery {
  try {
    // jQuery-lite对象本身应该已经符合JQueryObject接口
    const jqObj = jqLite as JQueryObject;
    return jqObj as unknown as JQuery<HTMLElement>;
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
export function $(selector: TypeOrArray<HTMLElementOrString>): JQuery {
  jqueryLogger.debug(`jQuery适配器调用，选择器：${selector}`);
  return convertToJQueryObject($lite(selector));
}

// 添加日志到jQuery-lite的html方法
function addLoggingToJQueryLiteHtml() {
  if ($lite.fn && $lite.fn.html && !$lite.fn._originalHtml) {
    jqueryLogger.debug('重写jQuery-lite.fn.html方法，添加日志');
    
    $lite.fn._originalHtml = $lite.fn.html;
    $lite.fn.html = function(htmlString?: string): any {
      if (htmlString === undefined) {
        jqueryLogger.debug('jQuery-lite.fn.html被调用(获取模式)');
        return $lite.fn._originalHtml.call(this);
      } else {
        jqueryLogger.debug(`jQuery-lite.fn.html被调用(设置模式), HTML长度: ${htmlString?.length || 0}`);
        try {
          const result = $lite.fn._originalHtml.call(this, htmlString);
          jqueryLogger.debug('jQuery-lite.fn.html设置成功');
          return result;
        } catch (error) {
          jqueryLogger.error(`jQuery-lite.fn.html设置失败: ${error}`);
          throw error;
        }
      }
    };
  }
}

// 添加日志到jQuery-lite的html方法
addLoggingToJQueryLiteHtml();

// 导出jQuery兼容接口
export const jQuery = $;

// 重新导出jQuery-lite函数
export { $ }; 