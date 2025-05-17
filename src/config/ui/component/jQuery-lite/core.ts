/**
 * jQuery-lite 核心实现
 */

import { createLogger } from '../logger';
import { JQueryLite } from './types';
import * as dom from './dom';
import { safeInnerHTML } from '../../../../jQuery-lite/dom';

// 创建核心组件专用的日志记录器
const coreLogger = createLogger('jquery-lite:core');

/**
 * DOM集合类，实现JQueryLite接口
 */
export class DOMCollection<T extends Element = Element> implements JQueryLite<T> {
  length: number = 0;
  [index: number]: T;

  constructor(elements: T[] | NodeListOf<T> | HTMLCollection | T) {
    if (!elements) return;

    // 处理单个元素
    if (elements instanceof Element) {
      this[0] = elements as T;
      this.length = 1;
      return;
    }

    // 处理元素集合
    let i = 0;
    const addElement = (el: Element) => {
      if (el instanceof Element) {
        this[i] = el as T;
        i++;
      }
    };

    if (elements instanceof NodeList || elements instanceof HTMLCollection) {
      Array.from(elements).forEach(addElement);
    } else if (Array.isArray(elements)) {
      elements.forEach(addElement);
    }

    this.length = i;
  }
  
  // 选择器方法
  find(selector: string): JQueryLite<Element> {
    const results: Element[] = [];
    this.each((_, el) => {
      const found = el.querySelectorAll(selector);
      found.forEach(item => results.push(item));
    });
    return new DOMCollection<Element>(results);
  }
  
  filter(predicate: (element: T, index: number) => boolean): JQueryLite<T> {
    const results: T[] = [];
    this.each((index, el) => {
      if (predicate(el, index)) {
        results.push(el);
      }
    });
    return new DOMCollection<T>(results);
  }
  
  parent(): JQueryLite<Element> {
    const parents: Element[] = [];
    this.each((_, el) => {
      if (el.parentNode && el.parentNode instanceof Element) {
        const parent = el.parentNode;
        if (parents.indexOf(parent) === -1) {
          parents.push(parent);
        }
      }
    });
    return new DOMCollection<Element>(parents);
  }
  
  children(): JQueryLite<Element> {
    const children: Element[] = [];
    this.each((_, el) => {
      Array.from(el.children).forEach(child => {
        if (children.indexOf(child) === -1) {
          children.push(child);
        }
      });
    });
    return new DOMCollection<Element>(children);
  }
  
  closest(selector: string): JQueryLite<Element> {
    const matches: Element[] = [];
    this.each((_, el) => {
      // 使用Element.closest()原生方法，避免类型问题
      const closestElement = el.closest(selector);
      if (closestElement && matches.indexOf(closestElement) === -1) {
        matches.push(closestElement);
      }
    });
    return new DOMCollection<Element>(matches);
  }
  
  // DOM操作方法
  append(content: string | Node | JQueryLite): JQueryLite<T> {
    if (typeof content === 'string') {
      try {
        const nodes = dom.parseHTML(content);
        const fragment = document.createDocumentFragment();
        nodes.forEach(node => fragment.appendChild(node.cloneNode(true)));
        
        this.each((_, el) => {
          el.appendChild(fragment.cloneNode(true));
        });
      } catch (error) {
        coreLogger.error(`附加HTML内容失败: ${error}`);
      }
    } else if (content instanceof Node) {
      this.each((_, el) => {
        el.appendChild(content.cloneNode(true));
      });
    } else if ('length' in content) {
      const jqContent = content as JQueryLite;
      this.each((_, el) => {
        for (let i = 0; i < jqContent.length; i++) {
          el.appendChild(jqContent[i].cloneNode(true));
        }
      });
    }
    return this;
  }
  
  prepend(content: string | Node | JQueryLite): JQueryLite<T> {
    if (typeof content === 'string') {
      try {
        const nodes = dom.parseHTML(content);
        const fragment = document.createDocumentFragment();
        nodes.forEach(node => fragment.appendChild(node));
        
        this.each((_, el) => {
          if (el.firstChild) {
            el.insertBefore(fragment.cloneNode(true), el.firstChild);
          } else {
            el.appendChild(fragment.cloneNode(true));
          }
        });
      } catch (error) {
        coreLogger.error(`前置HTML内容失败: ${error}`);
      }
    } else if (content instanceof Node) {
      this.each((_, el) => {
        if (el.firstChild) {
          el.insertBefore(content.cloneNode(true), el.firstChild);
        } else {
          el.appendChild(content.cloneNode(true));
        }
      });
    } else if ('length' in content) {
      const jqContent = content as JQueryLite;
      this.each((_, el) => {
        for (let i = jqContent.length - 1; i >= 0; i--) {
          if (el.firstChild) {
            el.insertBefore(jqContent[i].cloneNode(true), el.firstChild);
          } else {
            el.appendChild(jqContent[i].cloneNode(true));
          }
        }
      });
    }
    return this;
  }
  
  before(content: string | Node | JQueryLite): JQueryLite<T> {
    if (typeof content === 'string') {
      try {
        const nodes = dom.parseHTML(content);
        const fragment = document.createDocumentFragment();
        nodes.forEach(node => fragment.appendChild(node));
        
        this.each((_, el) => {
          if (el.parentNode) {
            el.parentNode.insertBefore(fragment.cloneNode(true), el);
          }
        });
      } catch (error) {
        coreLogger.error(`在元素之前插入HTML内容失败: ${error}`);
      }
    } else if (content instanceof Node) {
      this.each((_, el) => {
        if (el.parentNode) {
          el.parentNode.insertBefore(content.cloneNode(true), el);
        }
      });
    } else if ('length' in content) {
      const jqContent = content as JQueryLite;
      this.each((_, el) => {
        if (el.parentNode) {
          for (let i = 0; i < jqContent.length; i++) {
            el.parentNode.insertBefore(jqContent[i].cloneNode(true), el);
          }
        }
      });
    }
    return this;
  }
  
  after(content: string | Node | JQueryLite): JQueryLite<T> {
    if (typeof content === 'string') {
      try {
        const nodes = dom.parseHTML(content);
        const fragment = document.createDocumentFragment();
        nodes.forEach(node => fragment.appendChild(node));
        
        this.each((_, el) => {
          if (el.parentNode) {
            if (el.nextSibling) {
              el.parentNode.insertBefore(fragment.cloneNode(true), el.nextSibling);
            } else {
              el.parentNode.appendChild(fragment.cloneNode(true));
            }
          }
        });
      } catch (error) {
        coreLogger.error(`在元素之后插入HTML内容失败: ${error}`);
      }
    } else if (content instanceof Node) {
      this.each((_, el) => {
        if (el.parentNode) {
          if (el.nextSibling) {
            el.parentNode.insertBefore(content.cloneNode(true), el.nextSibling);
          } else {
            el.parentNode.appendChild(content.cloneNode(true));
          }
        }
      });
    } else if ('length' in content) {
      const jqContent = content as JQueryLite;
      this.each((_, el) => {
        if (el.parentNode) {
          for (let i = jqContent.length - 1; i >= 0; i--) {
            if (el.nextSibling) {
              el.parentNode.insertBefore(jqContent[i].cloneNode(true), el.nextSibling);
            } else {
              el.parentNode.appendChild(jqContent[i].cloneNode(true));
            }
          }
        }
      });
    }
    return this;
  }
  
  remove(): JQueryLite<T> {
    this.each((_, el) => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
    return this;
  }
  
  empty(): JQueryLite<T> {
    this.each((_, el) => {
      while (el.firstChild) {
        el.removeChild(el.firstChild);
      }
    });
    return this;
  }
  
  html(content?: string): string | JQueryLite<T> {
    if (content === undefined) {
      return this.length > 0 ? this[0].innerHTML : '';
    }
    
    this.each((_, el) => {
      safeInnerHTML(el, content);
    });
    
    return this;
  }
  
  text(content?: string): string | JQueryLite<T> {
    if (content === undefined) {
      let combinedText = '';
      this.each((_, el) => {
        combinedText += el.textContent || '';
      });
      return combinedText;
    }
    
    this.each((_, el) => {
      el.textContent = content;
    });
    
    return this;
  }
  
  val(): string | undefined;
  val(value: string): JQueryLite<T>;
  val(value?: string): string | JQueryLite<T> | undefined {
    if (value === undefined) {
      if (this.length === 0) return undefined;
      
      // 安全地检查元素是否有value属性，并获取值
      const el = this[0];
      if ('value' in el) {
        return (el as unknown as {value: string}).value;
      }
      return undefined;
    }
    
    this.each((_, el) => {
      if ('value' in el) {
        (el as unknown as {value: string}).value = value;
      }
    });
    
    return this;
  }
  
  // CSS类操作
  addClass(className: string): JQueryLite<T> {
    this.each((_, el) => {
      el.classList.add(...className.split(/\s+/).filter(Boolean));
    });
    return this;
  }
  
  removeClass(className: string): JQueryLite<T> {
    this.each((_, el) => {
      el.classList.remove(...className.split(/\s+/).filter(Boolean));
    });
    return this;
  }
  
  toggleClass(className: string): JQueryLite<T> {
    this.each((_, el) => {
      className.split(/\s+/).filter(Boolean).forEach(cls => {
        el.classList.toggle(cls);
      });
    });
    return this;
  }
  
  hasClass(className: string): boolean {
    if (this.length === 0) return false;
    return this[0].classList.contains(className);
  }
  
  // CSS样式操作
  css(property: string): string;
  css(property: string, value: string): JQueryLite<T>;
  css(properties: Record<string, string>): JQueryLite<T>;
  css(propertyOrProperties: string | Record<string, string>, value?: string): string | JQueryLite<T> {
    // 获取CSS值
    if (typeof propertyOrProperties === 'string' && value === undefined) {
      if (this.length === 0) return '';
      return dom.getComputedStyle(this[0], propertyOrProperties);
    }
    
    // 设置单个CSS属性
    if (typeof propertyOrProperties === 'string' && value !== undefined) {
      this.each((_, el) => {
        (el as unknown as HTMLElement).style.setProperty(propertyOrProperties, value);
      });
      return this;
    }
    
    // 设置多个CSS属性
    if (typeof propertyOrProperties === 'object') {
      this.each((_, el) => {
        const htmlEl = el as unknown as HTMLElement;
        for (const prop in propertyOrProperties) {
          if (Object.prototype.hasOwnProperty.call(propertyOrProperties, prop)) {
            htmlEl.style.setProperty(prop, propertyOrProperties[prop]);
          }
        }
      });
    }
    
    return this;
  }
  
  show(): JQueryLite<T> {
    this.each((_, el) => {
      (el as unknown as HTMLElement).style.display = '';
    });
    return this;
  }
  
  hide(): JQueryLite<T> {
    this.each((_, el) => {
      (el as unknown as HTMLElement).style.display = 'none';
    });
    return this;
  }
  
  // 属性操作
  attr(name: string): string | null;
  attr(name: string, value: string): JQueryLite<T>;
  attr(attributes: Record<string, string>): JQueryLite<T>;
  attr(nameOrAttributes: string | Record<string, string>, value?: string): string | null | JQueryLite<T> {
    // 获取属性
    if (typeof nameOrAttributes === 'string' && value === undefined) {
      if (this.length === 0) return null;
      return this[0].getAttribute(nameOrAttributes);
    }
    
    // 设置单个属性
    if (typeof nameOrAttributes === 'string' && value !== undefined) {
      this.each((_, el) => {
        el.setAttribute(nameOrAttributes, value);
      });
      return this;
    }
    
    // 设置多个属性
    if (typeof nameOrAttributes === 'object') {
      this.each((_, el) => {
        for (const name in nameOrAttributes) {
          if (Object.prototype.hasOwnProperty.call(nameOrAttributes, name)) {
            el.setAttribute(name, nameOrAttributes[name]);
          }
        }
      });
    }
    
    return this;
  }
  
  removeAttr(name: string): JQueryLite<T> {
    this.each((_, el) => {
      el.removeAttribute(name);
    });
    return this;
  }
  
  // 数据属性
  data(key: string): any;
  data(key: string, value: any): JQueryLite<T>;
  data(key: string, value?: any): any | JQueryLite<T> {
    // 获取数据
    if (value === undefined) {
      if (this.length === 0) return undefined;
      
      const el = this[0] as unknown as HTMLElement;
      return dom.getDataFromElement(el, key);
    }
    
    // 设置数据
    this.each((_, el) => {
      dom.setDataToElement(el as unknown as HTMLElement, key, value);
    });
    
    return this;
  }
  
  // 事件处理
  on(eventType: string, selectorOrHandler: string | ((event: Event) => void), handler?: (event: Event) => void): JQueryLite<T> {
    // 事件委托
    if (typeof selectorOrHandler === 'string' && handler) {
      const selector = selectorOrHandler;
      this.each((_, el) => {
        const wrappedHandler = (event: Event) => {
          const target = event.target as Element;
          if (!target) return;
          
          // 查找匹配的元素
          if (target.matches(selector) || target.closest(selector)) {
            handler.call(target, event);
          }
        };
        
        // 存储原始处理程序引用，以便以后可以移除
        if (!el.__jqlHandlers) {
          el.__jqlHandlers = {} as Record<string, Function[]>;
        }
        
        if (!el.__jqlHandlers[eventType]) {
          el.__jqlHandlers[eventType] = [];
        }
        
        el.__jqlHandlers[eventType].push(wrappedHandler);
        el.addEventListener(eventType, wrappedHandler as EventListener);
      });
      
      return this;
    }
    
    // 直接事件绑定
    if (typeof selectorOrHandler === 'function') {
      const directHandler = selectorOrHandler;
      this.each((_, el) => {
        if (!el.__jqlHandlers) {
          el.__jqlHandlers = {} as Record<string, Function[]>;
        }
        
        if (!el.__jqlHandlers[eventType]) {
          el.__jqlHandlers[eventType] = [];
        }
        
        el.__jqlHandlers[eventType].push(directHandler);
        el.addEventListener(eventType, directHandler as EventListener);
      });
    }
    
    return this;
  }
  
  off(eventType: string, handler?: (event: Event) => void): JQueryLite<T> {
    this.each((_, el) => {
      if (!el.__jqlHandlers || !el.__jqlHandlers[eventType]) return;
      
      if (handler) {
        // 移除特定处理程序
        const index = el.__jqlHandlers[eventType].indexOf(handler);
        if (index !== -1) {
          el.removeEventListener(eventType, handler as EventListener);
          el.__jqlHandlers[eventType].splice(index, 1);
        }
      } else {
        // 移除所有该类型的处理程序
        el.__jqlHandlers[eventType].forEach(fn => {
          el.removeEventListener(eventType, fn as EventListener);
        });
        el.__jqlHandlers[eventType] = [];
      }
    });
    
    return this;
  }
  
  click(handler?: (event: Event) => void): JQueryLite<T> {
    if (handler) {
      return this.on('click', handler);
    } else {
      // 触发点击事件
      this.each((_, el) => {
        const event = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        el.dispatchEvent(event);
      });
      return this;
    }
  }
  
  // 遍历方法
  each(callback: (index: number, element: T) => void | boolean): JQueryLite<T> {
    for (let i = 0; i < this.length; i++) {
      const result = callback.call(this[i], i, this[i]);
      if (result === false) break;
    }
    return this;
  }
  
  // 工具方法
  is(selectorOrElement: string | ((index: number, element: T) => boolean) | Element | JQueryLite): boolean {
    if (this.length === 0) return false;
    
    if (typeof selectorOrElement === 'string') {
      return Array.from(this).some(el => el.matches(selectorOrElement));
    }
    
    if (typeof selectorOrElement === 'function') {
      return Array.from(this).some((el, index) => 
        selectorOrElement.call(el, index, el)
      );
    }
    
    if (selectorOrElement instanceof Element) {
      return Array.from(this).includes(selectorOrElement as unknown as T);
    }
    
    if (selectorOrElement && 'length' in selectorOrElement) {
      const jqElement = selectorOrElement as JQueryLite;
      return Array.from(this).some(el => {
        for (let i = 0; i < jqElement.length; i++) {
          if (el === jqElement[i]) return true;
        }
        return false;
      });
    }
    
    return false;
  }
  
  // jQuery兼容性方法
  get(index?: number): T | T[] | null {
    if (index === undefined) {
      return Array.from(this as unknown as ArrayLike<T>);
    }
    
    if (index < 0) index = this.length + index;
    return index >= 0 && index < this.length ? this[index] : null;
  }
  
  eq(index: number): JQueryLite<T> {
    if (index < 0) index = this.length + index;
    return index >= 0 && index < this.length 
      ? new DOMCollection([this[index]])
      : new DOMCollection([]);
  }
  
  first(): JQueryLite<T> {
    return this.length > 0 ? new DOMCollection([this[0]]) : new DOMCollection([]);
  }
  
  last(): JQueryLite<T> {
    return this.length > 0 ? new DOMCollection([this[this.length - 1]]) : new DOMCollection([]);
  }
} 