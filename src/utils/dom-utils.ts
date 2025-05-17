/**
 * DOM工具函数 - 原生JavaScript实现
 * 替代jQuery-lite，使用标准DOM API
 */

import { createLogger } from '../logger';

const domLogger = createLogger('dom-utils');

// Trusted Types 相关

// Trusted Types策略
let htmlPolicy: any = null;

/**
 * 初始化Trusted Types策略
 */
export function initTrustedTypesPolicy(): void {
  domLogger.debug('初始化Trusted Types策略');
  
  // 检查浏览器是否支持Trusted Types
  if (typeof window.trustedTypes === 'undefined') {
    domLogger.info('浏览器不支持Trusted Types，使用简单polyfill');
    
    // 创建简单polyfill
    (window as any).trustedTypes = {
      createPolicy: (name: string, rules: any) => {
        domLogger.info(`创建Trusted Types策略: ${name}`);
        return rules;
      }
    };
  }
  
  try {
    // 创建HTML策略
    const trustedTypes = window.trustedTypes!;
    
    // 尝试创建默认策略
    try {
      window.trustedTypes.createPolicy('default', {
        createHTML: (s: string) => s
      });
      domLogger.info('创建默认TrustedTypes策略成功');
    } catch (e) {
      // 忽略错误，默认策略可能已存在
    }
    
    // 创建我们自己的策略
    htmlPolicy = trustedTypes.createPolicy('js-script-hook-html', {
      createHTML: (html: string) => html
    });
    
    // 安装全局拦截器
    installTrustedTypesInterceptors();
    
    domLogger.info('Trusted Types策略初始化完成');
  } catch (error) {
    domLogger.error(`初始化Trusted Types策略失败: ${error}`);
  }
}

/**
 * 安装必要的TrustedTypes拦截器
 */
function installTrustedTypesInterceptors(): void {
  // 拦截innerHTML
  try {
    const originalInnerHTMLDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
    if (originalInnerHTMLDescriptor && originalInnerHTMLDescriptor.set) {
      const originalSetter = originalInnerHTMLDescriptor.set;
      
      Object.defineProperty(Element.prototype, 'innerHTML', {
        ...originalInnerHTMLDescriptor,
        set: function(html: string) {
          try {
            const trusted = createTrustedHTML(html);
            originalSetter.call(this, trusted);
          } catch (error) {
            domLogger.error(`拦截器处理innerHTML失败: ${error}`);
            
            // 备用方案
            try {
              const nodes = parseHTML(html);
              while (this.firstChild) {
                this.removeChild(this.firstChild);
              }
              nodes.forEach(node => this.appendChild(node));
            } catch (fallbackError) {
              domLogger.error(`innerHTML备用方案失败: ${fallbackError}`);
            }
          }
        }
      });
      
      domLogger.debug('innerHTML拦截器安装完成');
    }
  } catch (error) {
    domLogger.error(`安装innerHTML拦截器失败: ${error}`);
  }
}

/**
 * 使用Trusted Types策略创建安全的HTML
 */
function createTrustedHTML(html: string): any {
  try {
    if (htmlPolicy) {
      return htmlPolicy.createHTML(html);
    } 
    
    // 尝试使用默认策略
    if (window.trustedTypes && (window.trustedTypes as any).defaultPolicy) {
      try {
        return (window.trustedTypes as any).defaultPolicy.createHTML(html);
      } catch (e) {
        // 继续尝试其他方法
      }
    }
    
    // 最后的回退
    return html;
  } catch (error) {
    domLogger.error(`创建安全HTML失败: ${error}`);
    return html;
  }
}

/**
 * 安全地解析HTML字符串
 */
export function parseHTML(html: string): Node[] {
  try {
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
 */
export function safeInnerHTML(element: Element, html: string): void {
  try {
    const trusted = createTrustedHTML(html);
    element.innerHTML = trusted;
  } catch (error) {
    domLogger.error(`safeInnerHTML失败: ${error}`);
    
    // 备用方案
    try {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
      parseHTML(html).forEach(node => element.appendChild(node));
    } catch (fallbackError) {
      domLogger.error(`safeInnerHTML备用方案失败: ${fallbackError}`);
    }
  }
}

/**
 * DOM元素选择器和操作工具
 */
export class DOMUtils {
  // 元素数组
  private elements: Element[] = [];

  /**
   * 构造函数
   */
  constructor(selector: string | Element | Element[] | Document | DocumentFragment) {
    try {
      if (typeof selector === 'string') {
        if (selector.trim().startsWith('<')) {
          // 创建元素
          const fragment = document.createDocumentFragment();
          const template = document.createElement('template');
          safeInnerHTML(template, selector);
          fragment.appendChild(template.content);
          this.elements = Array.from(fragment.childNodes).filter(node => 
            node.nodeType === Node.ELEMENT_NODE
          ) as Element[];
        } else {
          // 查询选择器
          this.elements = Array.from(document.querySelectorAll(selector));
        }
      } else if (selector instanceof Element) {
        this.elements = [selector];
      } else if (Array.isArray(selector)) {
        this.elements = selector.filter(el => el instanceof Element) as Element[];
      } else if (selector instanceof Document || selector instanceof DocumentFragment) {
        this.elements = [document.documentElement];
      }
    } catch (error) {
      domLogger.error(`DOM选择失败: ${error}`);
    }
  }

  /**
   * 获取元素数量
   */
  get length(): number {
    return this.elements.length;
  }

  /**
   * 获取特定索引的元素
   */
  get(index: number): Element | null {
    return this.elements[index] || null;
  }

  /**
   * 设置或获取HTML内容
   */
  html(content?: string): string | DOMUtils {
    if (content === undefined) {
      return this.elements[0]?.innerHTML || '';
    }
    
    this.elements.forEach(el => {
      try {
        safeInnerHTML(el, content);
      } catch (error) {
        domLogger.error(`设置HTML失败: ${error}`);
      }
    });
    
    return this;
  }
  
  /**
   * 添加内容
   */
  append(content: string | Element | DocumentFragment): DOMUtils {
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
        domLogger.error(`添加内容失败: ${error}`);
      }
    });
    return this;
  }
  
  /**
   * 设置或获取CSS样式
   */
  css(prop: string | Record<string, string>, value?: string): string | DOMUtils {
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
  }
  
  /**
   * 显示元素
   */
  show(): DOMUtils {
    this.elements.forEach(el => {
      (el as HTMLElement).style.display = '';
    });
    return this;
  }
  
  /**
   * 隐藏元素
   */
  hide(): DOMUtils {
    this.elements.forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });
    return this;
  }
  
  /**
   * 查找子元素
   */
  find(selector: string): DOMUtils {
    const result: Element[] = [];
    this.elements.forEach(el => {
      try {
        const found = el.querySelectorAll(selector);
        result.push(...Array.from(found));
      } catch (error) {
        domLogger.error(`查找元素失败: ${error}`);
      }
    });
    return new DOMUtils(result);
  }

  /**
   * 添加类名
   */
  addClass(className: string): DOMUtils {
    this.elements.forEach(el => {
      el.classList.add(className);
    });
    return this;
  }

  /**
   * 移除类名
   */
  removeClass(className: string): DOMUtils {
    this.elements.forEach(el => {
      el.classList.remove(className);
    });
    return this;
  }

  /**
   * 切换类名
   */
  toggleClass(className: string): DOMUtils {
    this.elements.forEach(el => {
      el.classList.toggle(className);
    });
    return this;
  }

  /**
   * 获取/设置属性
   */
  attr(name: string, value?: string): string | null | DOMUtils {
    if (value === undefined) {
      return this.elements[0]?.getAttribute(name) || null;
    }
    
    this.elements.forEach(el => {
      el.setAttribute(name, value);
    });
    return this;
  }

  /**
   * 绑定事件
   */
  on(eventType: string, handler: EventListener): DOMUtils {
    this.elements.forEach(el => {
      el.addEventListener(eventType, handler);
    });
    return this;
  }

  /**
   * 解绑事件
   */
  off(eventType: string, handler?: EventListener): DOMUtils {
    this.elements.forEach(el => {
      if (handler) {
        el.removeEventListener(eventType, handler);
      } else {
        // 无法直接解绑所有事件，这只是一个占位符
        domLogger.warn('解绑所有事件处理程序不受原生DOM API支持');
      }
    });
    return this;
  }

  /**
   * 获取父元素
   */
  parent(): DOMUtils {
    const parents = this.elements.map(el => el.parentElement).filter(Boolean) as Element[];
    return new DOMUtils(parents);
  }

  /**
   * 获取子元素
   */
  children(): DOMUtils {
    const children: Element[] = [];
    this.elements.forEach(el => {
      children.push(...Array.from(el.children));
    });
    return new DOMUtils(children);
  }
}

/**
 * 选择器函数 - 创建DOMUtils实例
 */
export function dom(selector: string | Element | Element[] | Document | DocumentFragment): DOMUtils {
  return new DOMUtils(selector);
}

/**
 * DOM加载完成后执行
 */
dom.ready = function(callback: () => void) {
  if (document.readyState !== 'loading') {
    setTimeout(callback, 0);
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
};

// 声明全局类型
declare global {
  interface Window {
    trustedTypes?: {
      createPolicy: (name: string, rules: any) => any;
      defaultPolicy?: any;
    };
  }
} 