/**
 * jQuery适配器类型定义
 */

// 类型定义
export type TypeOrArray<T> = T | Array<T>;
export type HTMLElementOrString = HTMLElement | string;

// JQuery封装接口
export interface JQuery<TElement = HTMLElement> {
  length: number;
  [index: number]: TElement;
  each: (callback: (index: number, element: TElement) => void) => JQuery<TElement>;
  addClass: (className: string) => JQuery<TElement>;
  removeClass: (className: string) => JQuery<TElement>;
  toggleClass: (className: string) => JQuery<TElement>;
  attr: (name: string, value?: string) => string | JQuery<TElement>;
  prop: (name: string, value?: boolean) => boolean | JQuery<TElement>;
  css: (name: string | Record<string, string>, value?: string) => string | JQuery<TElement>;
  html: (htmlString?: string) => string | JQuery<TElement>;
  text: (text?: string) => string | JQuery<TElement>;
  append: (content: string | HTMLElement | JQuery) => JQuery<TElement>;
  appendTo: (target: string | HTMLElement | JQuery) => JQuery<TElement>;
  remove: () => JQuery<TElement>;
  on: (eventName: string, handler: EventListener) => JQuery<TElement>;
  off: (eventName: string, handler?: EventListener) => JQuery<TElement>;
  show: () => JQuery<TElement>;
  hide: () => JQuery<TElement>;
  toggle: () => JQuery<TElement>;
  val: (value?: string) => string | JQuery<TElement>;
  find: (selector: string) => JQuery<TElement>;
  filter: (selector: string) => JQuery<TElement>;
  parent: () => JQuery<TElement>;
  parents: (selector?: string) => JQuery<TElement>;
  children: (selector?: string) => JQuery<TElement>;
  first: () => JQuery<TElement>;
  last: () => JQuery<TElement>;
  eq: (index: number) => JQuery<TElement>;
}

// 适配器函数声明
export function $(selector: string | Element | Element[] | Document): JQuery<Element>;
export function jQuery(selector: string | Element | Element[] | Document): JQuery<Element>;
export default $;
