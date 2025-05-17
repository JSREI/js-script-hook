/**
 * jQuery-lite 工具函数
 */

import { createLogger } from '../logger';
import { JQueryLite } from './types';

const utilsLogger = createLogger('jquery-lite:utils');

/**
 * 检查对象是否是DOM元素
 */
export function isElement(obj: any): boolean {
  return obj instanceof Element;
}

/**
 * 检查元素是否匹配选择器
 */
export function matches(element: Element, selector: string): boolean {
  return element.matches(selector);
}

/**
 * 扩展对象属性
 */
export function extend<T>(target: T, ...sources: any[]): T {
  if (!target) return {} as T;
  
  sources.forEach(source => {
    if (!source) return;
    
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        (target as any)[key] = source[key];
      }
    }
  });
  
  return target;
}

/**
 * 安全地创建DOM元素
 * 注意: 此函数将在index.ts中直接实现，以避免循环依赖
 */
export function createElementWithAttrs(tag: string, attributes?: Record<string, string>, content?: string): JQueryLite {
  // 这个函数的实际实现在index.ts中
  throw new Error('此函数应通过$.create方式调用');
}

/**
 * 安全地从HTML字符串创建DOM元素
 * 注意: 此函数将在$safe函数中直接实现，以避免循环依赖
 */
export function createFromHTML(html: string): JQueryLite {
  // 这个函数的实际实现在index.ts中的$safe中
  throw new Error('此函数应通过$safe方式调用');
}

/**
 * DOM就绪事件处理
 */
export function documentReady(callback: () => void): void {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(callback, 1);
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
}

/**
 * 去除字符串两端空白
 */
export function trim(str: string): string {
  return str.trim();
}

/**
 * 生成唯一ID
 */
export function uniqueId(prefix: string = 'jql-'): string {
  return `${prefix}${Math.random().toString(36).substring(2, 10)}`;
} 