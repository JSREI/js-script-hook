/**
 * DOM工具兼容层
 * 
 * 这个文件是为了保持向后兼容性，将新的jQuery-lite库的DOM相关功能重新导出
 */

import $, { $safe } from '../jQuery-lite';
import { parseHTML } from '../jQuery-lite/dom';

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
 * 安全地设置元素的innerHTML
 * @param element 目标元素
 * @param html HTML内容
 */
export function safeSetInnerHTML(element: Element, html: string): void {
  $(element).html(html);
}

/**
 * 安全地添加元素
 */
export function appendElementSafely(parent: Element, html: string): void {
  $(parent).append(html);
}

// 重新导出jQuery-lite的DOM相关功能
export { parseHTML, $safe }; 