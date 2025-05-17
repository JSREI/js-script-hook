import { JQueryLite } from '../../../../jQuery-lite/types';

// 扩展JQuery类型以兼容JQueryLite
export interface JQuery<T extends Element = HTMLElement> extends JQueryLite<T> {
    // jQuery特有方法可以在这里扩展
}

// 适配器函数声明
export function toJQuery<T extends Element>(jQueryLite: JQueryLite<T>): JQuery<T>;
export function $(selector: string | Element | Element[] | Document | JQueryLite<Element>): JQuery<Element>;
export function $safe(htmlString: string): JQuery<Element>;
export default $;
