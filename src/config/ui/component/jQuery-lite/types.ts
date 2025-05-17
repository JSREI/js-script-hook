/**
 * jQuery-lite 类型定义
 */

/**
 * 定义JQueryLite接口，提供类似jQuery的基本功能
 */
export interface JQueryLite<T extends Element = Element> {
  // 基本属性
  length: number;
  [index: number]: T;
  
  // 选择器方法
  find(selector: string): JQueryLite<Element>;
  filter(predicate: (element: T, index: number) => boolean): JQueryLite<T>;
  parent(): JQueryLite<Element>;
  children(): JQueryLite<Element>;
  closest(selector: string): JQueryLite<Element>;
  
  // DOM操作
  append(content: string | Node | JQueryLite<Element>): JQueryLite<T>;
  prepend(content: string | Node | JQueryLite<Element>): JQueryLite<T>;
  before(content: string | Node | JQueryLite<Element>): JQueryLite<T>;
  after(content: string | Node | JQueryLite<Element>): JQueryLite<T>;
  remove(): JQueryLite<T>;
  empty(): JQueryLite<T>;
  html(content?: string): string | JQueryLite<T>;
  text(content?: string): string | JQueryLite<T>;
  val(): string | undefined;
  val(value: string): JQueryLite<T>;
  
  // CSS操作
  addClass(className: string): JQueryLite<T>;
  removeClass(className: string): JQueryLite<T>;
  toggleClass(className: string): JQueryLite<T>;
  hasClass(className: string): boolean;
  css(property: string): string;
  css(property: string, value: string): JQueryLite<T>;
  css(properties: Record<string, string>): JQueryLite<T>;
  show(): JQueryLite<T>;
  hide(): JQueryLite<T>;
  
  // 属性操作
  attr(name: string): string | null;
  attr(name: string, value: string): JQueryLite<T>;
  attr(attributes: Record<string, string>): JQueryLite<T>;
  removeAttr(name: string): JQueryLite<T>;
  data(key: string): any;
  data(key: string, value: any): JQueryLite<T>;
  
  // 事件处理
  on(eventType: string, selector: string, handler: (event: Event) => void): JQueryLite<T>;
  on(eventType: string, handler: (event: Event) => void): JQueryLite<T>;
  off(eventType: string, handler?: (event: Event) => void): JQueryLite<T>;
  click(handler?: (event: Event) => void): JQueryLite<T>;
  
  // 遍历
  each(callback: (index: number, element: T) => void | boolean): JQueryLite<T>;
  
  // 工具方法
  is(selector: string | ((index: number, element: T) => boolean)): boolean;
  is(element: Element | JQueryLite<Element>): boolean;
  
  // jQuery兼容性方法
  get(index?: number): T | T[] | null;
  eq(index: number): JQueryLite<T>;
  first(): JQueryLite<T>;
  last(): JQueryLite<T>;
}

// 声明额外的类型，扩展Element类型以支持事件处理程序存储
declare global {
  interface Element {
    __jqlHandlers?: Record<string, Function[]>;
  }
} 