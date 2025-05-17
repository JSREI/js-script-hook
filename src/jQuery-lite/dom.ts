/**
 * jQuery-lite DOM操作功能 - 精简版
 */

import { createLogger } from '../logger';

const domLogger = createLogger('jquery-lite:dom');

// Trusted Types 策略
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

// 声明全局类型
declare global {
  interface Window {
    trustedTypes?: {
      createPolicy: (name: string, rules: any) => any;
      defaultPolicy?: any;
    };
  }
} 