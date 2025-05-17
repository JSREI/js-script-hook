/**
 * jQuery-lite - 超轻量级DOM操作工具
 */

import { createLogger } from '../logger';
import { safeInnerHTML, initTrustedTypesPolicy } from './dom';

const jQueryLiteLogger = createLogger('jquery-lite');

// 导出Trusted Types初始化函数
export { initTrustedTypesPolicy };

// 定义jQuery-lite集合类型
interface JQueryLiteCollection {
  length: number;
  elements: Element[];
  [index: number]: Element;
  html: (content?: string) => JQueryLiteCollection;
  append: (content: string | Element | DocumentFragment) => JQueryLiteCollection;
  css: (prop: string | Record<string, string>, value?: string) => JQueryLiteCollection | string;
  show: () => JQueryLiteCollection;
  hide: () => JQueryLiteCollection;
  find: (selector: string) => JQueryLiteCollection;
}

/**
 * 核心选择器函数
 */
function $(selector: string | Element | Element[] | Document | DocumentFragment): JQueryLiteCollection {
  let elements: Element[] = [];

  try {
    if (typeof selector === 'string') {
      elements = Array.from(document.querySelectorAll(selector));
    } else if (selector instanceof Element) {
      elements = [selector];
    } else if (Array.isArray(selector)) {
      elements = selector.filter(el => el instanceof Element) as Element[];
    } else if (selector instanceof Document || selector instanceof DocumentFragment) {
      elements = [selector as unknown as Element];
    }
  } catch (error) {
    jQueryLiteLogger.error(`选择器查询失败: ${error}`);
  }

  // 创建集合对象
  const collection: JQueryLiteCollection = {
    length: elements.length,
    elements,

    html(content?: string) {
      if (content === undefined) {
        return this.elements[0]?.innerHTML || '';
      }
      
      this.elements.forEach(el => {
        try {
          safeInnerHTML(el, content);
        } catch (error) {
          jQueryLiteLogger.error(`设置HTML失败: ${error}`);
        }
      });
      
      return this;
    },
    
    append(content: string | Element | DocumentFragment) {
      this.elements.forEach(el => {
        try {
          if (typeof content === 'string') {
            const temp = document.createElement('template');
            safeInnerHTML(temp, content);
            el.appendChild(temp.content);
          } else if (content instanceof Element || content instanceof DocumentFragment) {
            el.appendChild(content);
          }
        } catch (error) {
          jQueryLiteLogger.error(`添加内容失败: ${error}`);
        }
      });
      return this;
    },
    
    css(prop: string | Record<string, string>, value?: string) {
      if (typeof prop === 'string' && value !== undefined) {
        this.elements.forEach(el => {
          (el as HTMLElement).style.setProperty(prop, value);
        });
        return this;
      } else if (typeof prop === 'string') {
        return window.getComputedStyle(this.elements[0]).getPropertyValue(prop);
      } else if (typeof prop === 'object') {
        this.elements.forEach(el => {
          for (const p in prop) {
            if (Object.prototype.hasOwnProperty.call(prop, p)) {
              (el as HTMLElement).style.setProperty(p, prop[p]);
            }
          }
        });
        return this;
      }
      return this;
    },
    
    show() {
      this.elements.forEach(el => {
        (el as HTMLElement).style.display = '';
      });
      return this;
    },
    
    hide() {
      this.elements.forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });
      return this;
    },
    
    find(selector: string) {
      const result: Element[] = [];
      this.elements.forEach(el => {
        try {
          const found = el.querySelectorAll(selector);
          result.push(...Array.from(found));
        } catch (error) {
          jQueryLiteLogger.error(`查找元素失败: ${error}`);
        }
      });
      return $(result);
    },
  } as JQueryLiteCollection; // 使用类型断言确保类型匹配
  
  // 添加索引访问
  for (let i = 0; i < elements.length; i++) {
    collection[i] = elements[i];
  }
  
  return collection;
}

// 添加DOM准备工具方法
$.ready = function(callback: () => void) {
  if (document.readyState !== 'loading') {
    setTimeout(callback, 0);
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
};

// 导出
export default $;
export { safeInnerHTML }; 