/**
 * JQuery到JQueryLite的适配器
 * 
 * 这个文件提供了一个适配层，使现有代码能够继续使用JQuery类型
 */

import $, { JQueryLite } from '../../../../jQuery-lite/index';
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
 * 转换jQuery对象为我们的JQueryObject
 * 
 * @param jq jQuery对象
 * @returns JQueryObject
 */
function convertToJQueryObject(jq: any): JQuery {
  try {
    // 原生jQuery对象本身应该已经符合JQueryObject接口
    const jqObj = jq as JQueryObject;
    return jqObj as unknown as JQuery<HTMLElement>;
  } catch (e) {
    jqueryLogger.error(`转换jQuery对象失败: ${e}`);
  }
  return jq;
}

/**
 * jQuery适配器
 * 
 * @param selector 选择器
 * @returns JQuery对象
 */
export function $(selector: TypeOrArray<HTMLElementOrString>): JQuery {
  // 存在jQuery则使用jQuery
  if (typeof window.jQuery !== 'undefined') {
    const jq = window.jQuery(selector);
    return convertToJQueryObject(jq);
  }
  
  // 否则使用我们自己的jQuery-lite
  return require('../../../../jQuery-lite').default(selector);
}

// 优化jQuery选择器
const jQuery_original = window.jQuery;

// 声明全局jQuery类型
declare global {
  interface Window {
    jQuery?: any;
  }
}

// 添加日志记录函数到jQuery的html方法
function addLoggingToJQueryHtml() {
  if (typeof window.jQuery !== 'undefined' && window.jQuery.fn && window.jQuery.fn.html) {
    jqueryLogger.debug('重写jQuery.fn.html方法，添加日志');
    
    if (!window.jQuery.fn._originalHtml) {
      window.jQuery.fn._originalHtml = window.jQuery.fn.html;
      
      window.jQuery.fn.html = function(htmlString?: string): any {
        if (htmlString === undefined) {
          jqueryLogger.debug('jQuery.fn.html被调用(获取模式)');
          return window.jQuery.fn._originalHtml.call(this);
        } else {
          jqueryLogger.debug(`jQuery.fn.html被调用(设置模式), HTML长度: ${htmlString.length}`);
          try {
            const result = window.jQuery.fn._originalHtml.call(this, htmlString);
            jqueryLogger.debug('jQuery.fn.html设置成功');
            return result;
          } catch (error) {
            jqueryLogger.error(`jQuery.fn.html设置失败: ${error}`);
            throw error;
          }
        }
      };
    }
  }
}

// 添加日志到jQuery的html方法
addLoggingToJQueryHtml();

// 重新导出jQuery-lite函数
export { $ };

// 导出jQuery类型
declare const jQuery: JQueryStatic;
export { jQuery };

// 导出JQuery类型
export type JQuery<TElement = HTMLElement> = any;

// 导出JQueryStatic类型
export interface JQueryStatic {
    (selector: string | Element | ArrayLike<Element>): JQuery;
    fn: any;
    extend(target: any, ...objects: any[]): any;
    // 其他jQuery静态方法
}

// 如果需要其他特定的jQuery类型，可以在这里添加

/**
 * jQuery适配器，用于在没有jQuery的环境中使用的polyfill
 */
export interface JQueryLite {
    (selector: string | Element | ArrayLike<Element>): any;
    fn: any;
    extend: (...args: any[]) => any;
}

/**
 * 获取jQuery或其适配器
 * @returns jQuery或其适配器
 */
export function getJQuery(): JQueryStatic | JQueryLite {
    jqueryLogger.debug('获取jQuery实例');
    
    // 如果页面上有jQuery，直接使用
    if (typeof jQuery !== 'undefined') {
        jqueryLogger.debug('使用页面上已有的jQuery');
        
        // 重写html方法，添加日志
        if (!jQuery.fn._originalHtml && jQuery.fn.html) {
            jqueryLogger.debug('重写jQuery.fn.html方法，添加日志');
            jQuery.fn._originalHtml = jQuery.fn.html;
            jQuery.fn.html = function(htmlString?: string): any {
                if (htmlString === undefined) {
                    jqueryLogger.debug('jQuery.fn.html被调用(获取模式)');
                    return jQuery.fn._originalHtml.call(this);
                } else {
                    jqueryLogger.debug(`jQuery.fn.html被调用(设置模式), HTML内容长度: ${htmlString.length}`);
                    try {
                        const result = jQuery.fn._originalHtml.call(this, htmlString);
                        jqueryLogger.debug('jQuery.fn.html设置成功');
                        return result;
                    } catch (error) {
                        jqueryLogger.error(`jQuery.fn.html设置失败: ${error}`);
                        throw error;
                    }
                }
            };
        }
        
        return jQuery;
    }
    
    // 否则使用jQuery-lite
    jqueryLogger.debug('页面上没有jQuery，使用jQuery-lite替代');
    
    // 导入我们自己的jQuery-lite作为替代
    const $lite = require('../../../../jQuery-lite').default;
    
    // 添加日志到html方法
    if (!$lite.fn._originalHtml && $lite.fn.html) {
        jqueryLogger.debug('重写jQuery-lite.fn.html方法，添加日志');
        $lite.fn._originalHtml = $lite.fn.html;
        $lite.fn.html = function(htmlString?: string): any {
            if (htmlString === undefined) {
                jqueryLogger.debug('jQuery-lite.fn.html被调用(获取模式)');
                return $lite.fn._originalHtml.call(this);
            } else {
                jqueryLogger.debug(`jQuery-lite.fn.html被调用(设置模式), HTML内容长度: ${htmlString.length}`);
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
    
    return $lite;
} 