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
    
    // 全局拦截所有innerHTML操作
    installInnerHTMLInterceptor();
    
    domLogger.info('Trusted Types策略初始化完成');
  } catch (error) {
    domLogger.error(`初始化Trusted Types策略失败: ${error}`);
  }
}

/**
 * 安装全局innerHTML拦截器，确保所有innerHTML操作都通过TrustedHTML
 */
function installInnerHTMLInterceptor(): void {
  try {
    // 1. 拦截innerHTML
    const originalInnerHTMLDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
    if (originalInnerHTMLDescriptor && originalInnerHTMLDescriptor.set) {
      domLogger.debug('开始安装innerHTML拦截器');
      
      const originalInnerHTMLSetter = originalInnerHTMLDescriptor.set;
      
      // 重新定义innerHTML的setter
      Object.defineProperty(Element.prototype, 'innerHTML', {
        ...originalInnerHTMLDescriptor,
        set: function(html: string) {
          // 尝试使用TrustedHTML处理
          try {
            const trusted = createTrustedHTML(html);
            originalInnerHTMLSetter.call(this, trusted);
            return;
          } catch (error) {
            domLogger.error(`拦截器中处理innerHTML失败: ${error}`);
            
            // 如果直接设置失败，尝试备用方案
            try {
              // 清空元素
              while (this.firstChild) {
                this.removeChild(this.firstChild);
              }
              
              // 使用parseHTML和appendChild
              const nodes = parseHTML(html);
              nodes.forEach(node => {
                this.appendChild(node);
              });
            } catch (fallbackError) {
              domLogger.error(`innerHTML拦截器备用方案也失败: ${fallbackError}`);
              // 最后尝试原始方法
              try {
                originalInnerHTMLSetter.call(this, html);
              } catch (finalError) {
                domLogger.error(`所有innerHTML设置方法都失败: ${finalError}`);
              }
            }
          }
        }
      });
      
      domLogger.info('innerHTML拦截器安装完成');
    } else {
      domLogger.warn('无法获取innerHTML原始描述符，拦截器安装失败');
    }
    
    // 2. 拦截outerHTML
    const originalOuterHTMLDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'outerHTML');
    if (originalOuterHTMLDescriptor && originalOuterHTMLDescriptor.set) {
      domLogger.debug('开始安装outerHTML拦截器');
      
      const originalOuterHTMLSetter = originalOuterHTMLDescriptor.set;
      
      Object.defineProperty(Element.prototype, 'outerHTML', {
        ...originalOuterHTMLDescriptor,
        set: function(html: string) {
          try {
            const trusted = createTrustedHTML(html);
            originalOuterHTMLSetter.call(this, trusted);
          } catch (error) {
            domLogger.error(`拦截器中处理outerHTML失败: ${error}`);
            
            // 尝试创建新元素并替换
            try {
              if (this.parentNode) {
                const temp = document.createElement('div');
                temp.innerHTML = createTrustedHTML(html);
                const fragment = document.createDocumentFragment();
                
                Array.from(temp.childNodes).forEach(node => {
                  fragment.appendChild(node);
                });
                
                this.parentNode.replaceChild(fragment, this);
              } else {
                domLogger.error('无法使用备用方案设置outerHTML：元素没有父节点');
                originalOuterHTMLSetter.call(this, html);
              }
            } catch (fallbackError) {
              domLogger.error(`outerHTML拦截器备用方案也失败: ${fallbackError}`);
              try {
                originalOuterHTMLSetter.call(this, html);
              } catch (finalError) {
                domLogger.error(`所有outerHTML设置方法都失败: ${finalError}`);
              }
            }
          }
        }
      });
      
      domLogger.info('outerHTML拦截器安装完成');
    } else {
      domLogger.warn('无法获取outerHTML原始描述符，拦截器安装失败');
    }
    
    // 3. 拦截insertAdjacentHTML
    const originalInsertAdjacentHTML = Element.prototype.insertAdjacentHTML;
    if (originalInsertAdjacentHTML) {
      domLogger.debug('开始安装insertAdjacentHTML拦截器');
      
      Element.prototype.insertAdjacentHTML = function(position: InsertPosition, html: string): void {
        try {
          const trusted = createTrustedHTML(html);
          originalInsertAdjacentHTML.call(this, position, trusted);
        } catch (error) {
          domLogger.error(`拦截器中处理insertAdjacentHTML失败: ${error}`);
          
          // 备用方案
          try {
            // 创建临时元素并解析HTML
            const temp = document.createElement('div');
            temp.innerHTML = createTrustedHTML(html);
            const fragment = document.createDocumentFragment();
            
            Array.from(temp.childNodes).forEach(node => {
              fragment.appendChild(node.cloneNode(true));
            });
            
            // 根据位置插入节点
            switch (position.toLowerCase()) {
              case 'beforebegin':
                if (this.parentNode) {
                  this.parentNode.insertBefore(fragment, this);
                }
                break;
              case 'afterbegin':
                this.insertBefore(fragment, this.firstChild);
                break;
              case 'beforeend':
                this.appendChild(fragment);
                break;
              case 'afterend':
                if (this.parentNode) {
                  this.parentNode.insertBefore(fragment, this.nextSibling);
                }
                break;
            }
          } catch (fallbackError) {
            domLogger.error(`insertAdjacentHTML拦截器备用方案也失败: ${fallbackError}`);
            try {
              originalInsertAdjacentHTML.call(this, position, html);
            } catch (finalError) {
              domLogger.error(`所有insertAdjacentHTML设置方法都失败: ${finalError}`);
            }
          }
        }
      };
      
      domLogger.info('insertAdjacentHTML拦截器安装完成');
    } else {
      domLogger.warn('无法获取insertAdjacentHTML方法，拦截器安装失败');
    }
    
    // 4. 拦截document.write和document.writeln
    if (Document.prototype.write) {
      domLogger.debug('开始安装document.write拦截器');
      
      const originalWrite = Document.prototype.write;
      Document.prototype.write = function(...args: string[]): void {
        try {
          const safeArgs = args.map(arg => createTrustedHTML(arg));
          originalWrite.apply(this, safeArgs);
        } catch (error) {
          domLogger.error(`拦截器中处理document.write失败: ${error}`);
          
          // 备用方案：创建一个脚本元素并插入到文档中
          try {
            const content = args.join('');
            const range = this.createRange();
            const fragment = range.createContextualFragment(createTrustedHTML(content));
            this.body.appendChild(fragment);
          } catch (fallbackError) {
            domLogger.error(`document.write拦截器备用方案也失败: ${fallbackError}`);
            try {
              originalWrite.apply(this, args);
            } catch (finalError) {
              domLogger.error(`所有document.write设置方法都失败: ${finalError}`);
            }
          }
        }
      };
      
      domLogger.info('document.write拦截器安装完成');
    } else {
      domLogger.warn('无法获取document.write方法，拦截器安装失败');
    }
    
    if (Document.prototype.writeln) {
      domLogger.debug('开始安装document.writeln拦截器');
      
      const originalWriteln = Document.prototype.writeln;
      Document.prototype.writeln = function(...args: string[]): void {
        try {
          const safeArgs = args.map(arg => createTrustedHTML(arg + '\n'));
          originalWriteln.apply(this, safeArgs);
        } catch (error) {
          domLogger.error(`拦截器中处理document.writeln失败: ${error}`);
          
          // 备用方案：使用document.write
          try {
            const content = args.join('') + '\n';
            if (Document.prototype.write) {
              this.write(content);
            } else {
              domLogger.error('document.write不可用，无法使用备用方案');
              originalWriteln.apply(this, args);
            }
          } catch (fallbackError) {
            domLogger.error(`document.writeln拦截器备用方案也失败: ${fallbackError}`);
            try {
              originalWriteln.apply(this, args);
            } catch (finalError) {
              domLogger.error(`所有document.writeln设置方法都失败: ${finalError}`);
            }
          }
        }
      };
      
      domLogger.info('document.writeln拦截器安装完成');
    } else {
      domLogger.warn('无法获取document.writeln方法，拦截器安装失败');
    }
    
    domLogger.info('全局HTML操作拦截器安装完成');
  } catch (interceptorError) {
    domLogger.error(`安装HTML操作拦截器失败: ${interceptorError}`);
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
  domLogger.debug(`开始执行safeInnerHTML, 目标元素: ${element.tagName}`);
  domLogger.debug(`HTML内容(前100字符): ${html.substring(0, 100)}${html.length > 100 ? '...' : ''}`);
  
  try {
    const trusted = createTrustedHTML(html);
    domLogger.debug(`创建的trusted对象类型: ${typeof trusted}`);
    
    // 尝试直接设置innerHTML
    try {
      element.innerHTML = trusted;
      domLogger.debug('直接设置innerHTML成功');
    } catch (innerError) {
      domLogger.error(`直接设置innerHTML失败: ${innerError}`);
      
      // 回退方案：清空元素并逐个添加节点
      domLogger.debug('使用回退方案');
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
      
      const nodes = parseHTML(html);
      domLogger.debug(`解析得到节点数量: ${nodes.length}`);
      nodes.forEach(node => {
        try {
          element.appendChild(node);
          domLogger.debug(`添加节点成功: ${node.nodeName}`);
        } catch (appendError) {
          domLogger.error(`添加节点失败: ${appendError}`);
        }
      });
    }
  } catch (error) {
    domLogger.error(`设置innerHTML失败: ${error}`);
    domLogger.error(`错误堆栈: ${error.stack}`);
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