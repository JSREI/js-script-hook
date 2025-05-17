/**
 * jQuery-lite - 轻量级jQuery替代库的主入口
 * 
 * 提供类似jQuery的基本DOM操作功能，但确保所有HTML操作都符合Trusted Types安全策略
 */

import { createLogger } from '../logger';
import { DOMCollection } from './core';
import { parseHTML, safeInnerHTML, initTrustedTypesPolicy } from './dom';
import { JQueryLite } from './types';

// 导入实用工具函数
import * as utils from './utils';

// 创建jquery-lite专用的日志记录器
const jqueryLiteLogger = createLogger('jquery-lite');

// 初始化Trusted Types策略
initTrustedTypesPolicy();
jqueryLiteLogger.info('jQuery安全扩展已初始化');

/**
 * 从CSS选择器、HTML字符串、DOM元素或数组创建JQueryLite实例
 */
export function $(selector: string | Element | Document | DocumentFragment | Node[] | NodeListOf<Element> | HTMLCollection | JQueryLite | null | undefined): JQueryLite {
  // 如果已经是JQueryLite对象，直接返回
  if (selector && typeof selector === 'object' && 'length' in selector && 'each' in selector) {
    return selector as JQueryLite;
  }
  
  // 处理null或undefined
  if (!selector) {
    return new DOMCollection([]);
  }
  
  // 处理已有元素或元素数组
  if (selector instanceof Element || selector instanceof Document || selector instanceof DocumentFragment) {
    return new DOMCollection([selector as Element]);
  }
  
  if (Array.isArray(selector)) {
    return new DOMCollection(selector.filter(el => el instanceof Element) as Element[]);
  }
  
  if (selector instanceof NodeList || selector instanceof HTMLCollection) {
    return new DOMCollection(selector);
  }
  
  // 处理字符串
  if (typeof selector === 'string') {
    selector = selector.trim();
    
    // HTML字符串
    if (selector.startsWith('<') && selector.endsWith('>')) {
      try {
        const nodes = parseHTML(selector);
        const elements = nodes.filter((node) => node.nodeType === Node.ELEMENT_NODE) as Element[];
        return new DOMCollection(elements);
      } catch (error) {
        jqueryLiteLogger.error(`解析HTML字符串失败: ${error}`);
        return new DOMCollection([]);
      }
    }
    
    // CSS选择器
    try {
      const elements = document.querySelectorAll(selector);
      return new DOMCollection(elements);
    } catch (error) {
      jqueryLiteLogger.error(`无效的选择器: ${error}`);
      return new DOMCollection([]);
    }
  }
  
  // 其他情况，返回空结果
  return new DOMCollection([]);
}

// 添加静态方法
$.parseHTML = parseHTML;
$.matches = utils.matches;
$.extend = utils.extend;
$.isElement = utils.isElement;
$.create = function(tag: string, attributes?: Record<string, string>, content?: string) {
  const element = document.createElement(tag);
  
  if (attributes) {
    for (const key in attributes) {
      if (Object.prototype.hasOwnProperty.call(attributes, key)) {
        element.setAttribute(key, attributes[key]);
      }
    }
  }
  
  if (content !== undefined) {
    element.textContent = content;
  }
  
  return $(element);
};
$.ready = utils.documentReady;
$.uniqueId = utils.uniqueId;

/**
 * 安全地从HTML字符串创建JQueryLite对象
 * 这是一个针对Trusted Types优化的特殊函数
 */
export function $safe(html: string): JQueryLite {
  try {
    const template = document.createElement('template');
    // 使用安全的innerHTML设置
    safeInnerHTML(template, html.trim());
    const elements = Array.from(template.content.children) as Element[];
    return new DOMCollection(elements);
  } catch (error) {
    jqueryLiteLogger.error(`从HTML字符串创建JQueryLite对象失败: ${error}`);
    return new DOMCollection([]);
  }
}

export { JQueryLite };
export default $; 