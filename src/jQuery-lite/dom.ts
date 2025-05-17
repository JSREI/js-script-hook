/**
 * jQuery-lite DOM操作功能
 */

import { createLogger } from '../logger';

const domLogger = createLogger('jquery-lite:dom');

// Trusted Types 相关变量和工具函数
let htmlPolicy: any = null;

/**
 * 初始化Trusted Types策略
 */
export function initTrustedTypesPolicy(): void {
  // 检查浏览器是否支持Trusted Types
  if (typeof window.trustedTypes === 'undefined') {
    domLogger.info('浏览器不支持Trusted Types，使用polyfill');
    
    // 创建一个简单的polyfill
    (window as any).trustedTypes = {
      createPolicy: (name: string, rules: any) => {
        domLogger.info(`创建Trusted Types策略: ${name}`);
        return rules;
      },
      emptyHTML: '',
      emptyScript: ''
    };
  }
  
  try {
    // 创建HTML策略
    const trustedTypes = window.trustedTypes!;
    htmlPolicy = trustedTypes.createPolicy('js-script-hook-html', {
      createHTML: (html: string) => html
    });
    
    domLogger.info('Trusted Types策略初始化完成');
  } catch (error) {
    domLogger.error(`初始化Trusted Types策略失败: ${error}`);
  }
}

/**
 * 使用Trusted Types策略创建安全的HTML
 */
function createTrustedHTML(html: string): any {
  if (!htmlPolicy) return html;
  try {
    return htmlPolicy.createHTML(html);
  } catch (error) {
    domLogger.error(`创建安全HTML失败: ${error}`);
    return html;
  }
}

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
    template.innerHTML = createTrustedHTML(html.trim());
    return Array.from(template.content.childNodes);
  } catch (error) {
    domLogger.error(`解析HTML失败: ${error}`);
    return [];
  }
}

/**
 * 安全地设置innerHTML
 * 
 * @param element 目标元素
 * @param html HTML内容
 */
export function safeInnerHTML(element: Element, html: string): void {
  try {
    element.innerHTML = createTrustedHTML(html);
  } catch (error) {
    domLogger.error(`设置innerHTML失败: ${error}`);
    
    // 回退方案：清空元素并逐个添加节点
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
    
    const nodes = parseHTML(html);
    nodes.forEach(node => {
      element.appendChild(node);
    });
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

// 声明全局类型
declare global {
  interface Window {
    trustedTypes?: {
      createPolicy: (name: string, rules: any) => any;
      emptyHTML: string;
      emptyScript: string;
    };
  }
} 