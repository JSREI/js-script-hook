/**
 * jQuery-lite DOM操作功能
 */

import { createLogger } from '../logger';

const domLogger = createLogger('jquery-lite:dom');

/**
 * 安全地解析HTML字符串
 * 
 * @param html HTML字符串
 * @returns 解析后的节点数组
 */
export function parseHTML(html: string): Node[] {
  try {
    // 使用安全的方式解析HTML
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return Array.from(template.content.childNodes);
  } catch (error) {
    domLogger.error(`解析HTML失败: ${error}`);
    return [];
  }
}

/**
 * 检查元素是否和选择器匹配
 * 
 * @param element 要检查的元素
 * @param selector CSS选择器
 * @returns 是否匹配
 */
export function matchesSelector(element: Element, selector: string): boolean {
  return element.matches(selector);
}

/**
 * 获取元素的计算样式
 * 
 * @param element 目标元素
 * @param property CSS属性名
 * @returns 计算后的CSS值
 */
export function getComputedStyle(element: Element, property: string): string {
  return window.getComputedStyle(element).getPropertyValue(property);
}

/**
 * 安全地设置元素样式
 * 
 * @param element 目标元素
 * @param property CSS属性名
 * @param value CSS属性值
 */
export function setStyle(element: HTMLElement, property: string, value: string): void {
  element.style.setProperty(property, value);
}

/**
 * 从元素的dataset获取数据
 * 
 * @param element 目标元素
 * @param key 数据键名
 * @returns 获取到的数据
 */
export function getDataFromElement(element: HTMLElement, key: string): any {
  // 将key转换为camelCase (data-foo-bar => fooBar)
  const camelKey = key.replace(/-([a-z])/g, (_: string, letter: string) => letter.toUpperCase());
  
  if (element.dataset && camelKey in element.dataset) {
    const value = element.dataset[camelKey];
    // 尝试解析JSON
    try {
      return JSON.parse(value as string);
    } catch (e) {
      return value;
    }
  }
  
  // 尝试从data-*属性获取
  const attrName = `data-${key}`;
  const attrValue = element.getAttribute(attrName);
  if (attrValue !== null) {
    // 尝试解析JSON
    try {
      return JSON.parse(attrValue);
    } catch (e) {
      return attrValue;
    }
  }
  
  return undefined;
}

/**
 * 为元素设置数据
 * 
 * @param element 目标元素
 * @param key 数据键名
 * @param value 数据值
 */
export function setDataToElement(element: HTMLElement, key: string, value: any): void {
  const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
  const camelKey = key.replace(/-([a-z])/g, (_: string, letter: string) => letter.toUpperCase());
  
  if (element.dataset) {
    element.dataset[camelKey] = valueStr;
  } else {
    element.setAttribute(`data-${key}`, valueStr);
  }
} 