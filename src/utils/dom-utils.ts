/**
 * DOM工具兼容层
 * 
 * 这个文件是为了保持向后兼容性，将新的jQuery-lite库的DOM相关功能重新导出
 */

import $, { $safe } from '../jQuery-lite';
import { parseHTML } from '../jQuery-lite/dom';
import { createLogger } from '../logger';

// 为dom-utils创建日志记录器
const domUtilsLogger = createLogger('dom-utils');

/**
 * 安全地创建DOM元素
 */
export function createElementSafely(html: string): DocumentFragment {
  const template = document.createElement('template');
  const elements = $safe(html);
  if (elements.length > 0) {
    elements.each((_, el) => {
      template.content.appendChild(el);
    });
  }
  return template.content;
}

/**
 * 安全地从HTML字符串创建元素
 * @param html HTML字符串
 * @returns 创建的元素
 */
export function safeCreateElementFromHTML(html: string): Element {
  const elements = $safe(html);
  if (elements.length > 0) {
    return elements[0];
  }
  // 如果没有创建成功，返回一个空的div
  return document.createElement('div');
}

/**
 * 安全地设置元素内容
 */
export function setElementContentSafely(element: Element, html: string): void {
  $(element).html(html);
}

/**
 * Safely set innerHTML property of a DOM element.
 * 
 * @param element - DOM element to modify
 * @param html - HTML content to set
 */
export function safeSetInnerHTML(element: HTMLElement, html: string): void {
  domUtilsLogger.debug(`开始执行safeSetInnerHTML, 目标元素: ${element.tagName}`);
  domUtilsLogger.debug(`HTML内容(前100字符): ${html.substring(0, 100)}${html.length > 100 ? '...' : ''}`);
  
  // 尝试用jQuery包装
  try {
    domUtilsLogger.debug('尝试用jQuery包装元素');
    const $element = $(element);
    
    try {
      domUtilsLogger.debug('尝试用jQuery的html方法设置内容');
      $element.html(html);
      domUtilsLogger.debug('jQuery设置HTML成功');
      return;
    } catch (jqueryError) {
      domUtilsLogger.error(`jQuery设置HTML失败: ${jqueryError}`);
      // 继续尝试其他方法
    }
  } catch (jqWrapError) {
    domUtilsLogger.error(`jQuery包装元素失败: ${jqWrapError}`);
  }

  // 尝试直接设置innerHTML
  try {
    domUtilsLogger.debug('尝试直接设置innerHTML');
    element.innerHTML = html;
    domUtilsLogger.debug('直接设置innerHTML成功');
  } catch (innerHtmlError) {
    domUtilsLogger.error(`直接设置innerHTML失败: ${innerHtmlError}`);
    
    // 回退到textContent（这会丢失HTML格式）
    try {
      domUtilsLogger.debug('尝试使用textContent作为回退方案');
      element.textContent = html;
      domUtilsLogger.debug('设置textContent成功');
    } catch (textContentError) {
      domUtilsLogger.error(`设置textContent也失败: ${textContentError}`);
    }
  }
}

/**
 * 安全地添加元素
 */
export function appendElementSafely(parent: Element, html: string): void {
  $(parent).append(html);
}

// 重新导出jQuery-lite的DOM相关功能
export { parseHTML, $safe }; 