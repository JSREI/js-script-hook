/**
 * JQuery到JQueryLite的适配器
 * 
 * 这个文件提供了一个适配层，使现有代码能够继续使用JQuery类型
 */

import $, { JQueryLite } from '../../../../jQuery-lite/index';
import { createLogger } from '../../../../logger';

const logger = createLogger('jquery-adapter');

// TypeOrArray类型定义，兼容jQuery的选择器用法
type TypeOrArray<T> = T | T[];

// 声明JQuery类型，以便与现有代码兼容
export interface JQuery<T extends Element = HTMLElement> {
  // 基本属性
  length: number;
  [index: number]: T;
  jquery: string;
  
  // 覆盖核心JQueryLite方法，使其类型与原生jQuery兼容
  find(selector: string): JQuery<HTMLElement>;
  filter(selector_elements_selection_function: string | JQuery<HTMLElement> | TypeOrArray<Element> | ((this: any, index: number, element: any) => boolean)): JQuery<HTMLElement>;
  parent(selector?: string): JQuery<HTMLElement>;
  children(selector?: string): JQuery<HTMLElement>;
  closest(selector: string): JQuery<HTMLElement>;
  
  // DOM操作
  append(content: string | Node | JQuery<HTMLElement>): JQuery<HTMLElement>;
  prepend(content: string | Node | JQuery<HTMLElement>): JQuery<HTMLElement>;
  before(content: string | Node | JQuery<HTMLElement>): JQuery<HTMLElement>;
  after(content: string | Node | JQuery<HTMLElement>): JQuery<HTMLElement>;
  remove(): JQuery<HTMLElement>;
  empty(): JQuery<HTMLElement>;
  html(content?: string): string | JQuery<HTMLElement>;
  text(content?: string): string | JQuery<HTMLElement>;
  val(): string | undefined;
  val(value: string): JQuery<HTMLElement>;
  
  // CSS操作
  addClass(className: string): JQuery<HTMLElement>;
  removeClass(className: string): JQuery<HTMLElement>;
  toggleClass(className: string): JQuery<HTMLElement>;
  hasClass(className: string): boolean;
  css(property: string): string;
  css(property: string, value: string): JQuery<HTMLElement>;
  css(properties: Record<string, string>): JQuery<HTMLElement>;
  show(): JQuery<HTMLElement>;
  hide(): JQuery<HTMLElement>;
  
  // 属性操作
  attr(name: string): string | null;
  attr(name: string, value: string): JQuery<HTMLElement>;
  attr(attributes: Record<string, string>): JQuery<HTMLElement>;
  removeAttr(name: string): JQuery<HTMLElement>;
  data(key: string): any;
  data(key: string, value: any): JQuery<HTMLElement>;
  
  // 事件处理
  on(eventType: string, selector: string, handler: (event: Event) => void): JQuery<HTMLElement>;
  on(eventType: string, handler: (event: Event) => void): JQuery<HTMLElement>;
  off(eventType: string, handler?: (event: Event) => void): JQuery<HTMLElement>;
  click(handler?: (event: Event) => void): JQuery<HTMLElement>;
  
  // 遍历
  each(callback: (index: number, element: T) => void | boolean): JQuery<HTMLElement>;
  
  // 工具方法
  is(selector: string | ((index: number, element: T) => boolean)): boolean;
  is(element: Element | JQuery<HTMLElement>): boolean;
  
  // jQuery兼容性方法
  get(index?: number): T | T[] | null;
  eq(index: number): JQuery<HTMLElement>;
  first(): JQuery<HTMLElement>;
  last(): JQuery<HTMLElement>;
  
  // jQuery特有方法的存根，返回类型应与原生jQuery保持一致
  add: any;
  addBack: any;
  ajaxComplete: any;
  // 其他jQuery方法...
}

/**
 * 将JQueryLite对象转换为JQuery对象
 */
export function toJQuery<T extends Element = HTMLElement>(obj: JQueryLite<any>): JQuery<T> {
  const jqObj = obj as unknown as JQuery<T>;
  // 添加jquery属性以便类型检查通过
  jqObj.jquery = '3.6.0-lite';
  
  // 可能需要处理的额外方法
  const originalMethods = {
    append: jqObj.append.bind(jqObj),
    prepend: jqObj.prepend.bind(jqObj),
    before: jqObj.before.bind(jqObj),
    after: jqObj.after.bind(jqObj),
    filter: jqObj.filter.bind(jqObj),
  };
  
  // 覆盖append方法以支持jQuery对象作为参数
  jqObj.append = function(content: string | Node | JQuery<HTMLElement>): JQuery<HTMLElement> {
    // 处理jQuery对象
    if (content && typeof content === 'object' && 'jquery' in content) {
      try {
        // 获取jQuery对象中的实际DOM元素
        const nodeArray = Array.from({ length: content.length }, (_, i) => content[i]);
        // 单独处理每个元素
        nodeArray.forEach(node => {
          originalMethods.append(node);
        });
        return jqObj as unknown as JQuery<HTMLElement>;
      } catch (e) {
        logger.error(`转换jQuery对象失败: ${e}`);
      }
    }
    return originalMethods.append(content as any) as unknown as JQuery<HTMLElement>;
  };
  
  // 类似地，覆盖其他可能需要特殊处理的方法
  // ...
  
  return jqObj;
}

/**
 * jQuery函数，兼容原生jQuery API
 */
export function jQuery<T extends Element = HTMLElement>(
  selector: string | Element | Document | DocumentFragment | Node[] | NodeListOf<Element> | HTMLCollection | JQuery<T> | JQueryLite<T> | null | undefined
): JQuery<T> {
  // 处理jQuery对象
  if (selector && typeof selector === 'object' && 'jquery' in selector) {
    return selector as JQuery<T>;
  }
  
  // 处理JQueryLite对象
  if (selector && typeof selector === 'object' && 'length' in selector && 'each' in selector) {
    return toJQuery(selector as JQueryLite<T>);
  }
  
  // 处理其他情况
  return toJQuery($(selector as any));
}

// 提供静态方法，与jQuery兼容
jQuery.ready = function(callback: () => void): void {
  $.ready(callback);
};

jQuery.isEmptyObject = function(obj: any): boolean {
  return obj !== null && typeof obj === 'object' && Object.keys(obj).length === 0;
};

jQuery.extend = function(target: any, ...sources: any[]): any {
  sources.forEach((source) => {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  });
  return target;
};

jQuery.uniqueId = $.uniqueId;

// 重新导出jQuery-lite函数
export { $ }; 