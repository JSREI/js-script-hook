/**
 * DOM工具兼容层
 * 
 * 这个文件是为了保持向后兼容性，将新的jQuery-lite库的DOM相关功能重新导出
 */

import $ from '../jQuery-lite';
import { safeInnerHTML } from '../jQuery-lite';
import { parseHTML } from '../jQuery-lite/dom';
import { createLogger } from '../logger';

// 为dom-utils创建日志记录器
const domUtilsLogger = createLogger('dom-utils');

/**
 * 安全地创建DOM元素
 */
export function createElementSafely(html: string): DocumentFragment {
  const template = document.createElement('template');
  safeInnerHTML(template, html);
  return template.content;
}

/**
 * 安全地从HTML字符串创建元素
 * @param html HTML字符串
 * @returns 创建的元素
 */
export function safeCreateElementFromHTML(html: string): Element {
  try {
    domUtilsLogger.debug('创建元素: 使用template解析HTML');
    const template = document.createElement('template');
    safeInnerHTML(template, html);
    
    if (template.content.firstElementChild) {
      domUtilsLogger.debug(`成功创建元素: ${template.content.firstElementChild.tagName}`);
      return template.content.firstElementChild;
    } else {
      domUtilsLogger.warn('HTML解析后没有元素节点，返回空div');
    }
  } catch (error) {
    domUtilsLogger.error(`创建元素失败: ${error}`);
  }
  
  // 如果没有创建成功，返回一个空的div
  return document.createElement('div');
}

/**
 * 安全地设置元素内容
 */
export function setElementContentSafely(element: Element, html: string): void {
  safeInnerHTML(element, html);
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
  
  // 直接使用我们的安全函数
  try {
    domUtilsLogger.debug('使用safeInnerHTML函数设置内容');
    safeInnerHTML(element, html);
    domUtilsLogger.debug('设置HTML成功');
  } catch (error) {
    domUtilsLogger.error(`设置HTML失败: ${error}`);
    
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
  try {
    const fragment = createElementSafely(html);
    parent.appendChild(fragment);
  } catch (error) {
    domUtilsLogger.error(`安全添加元素失败: ${error}`);
  }
}

// 重新导出jQuery-lite的DOM相关功能
export { parseHTML, safeInnerHTML }; 