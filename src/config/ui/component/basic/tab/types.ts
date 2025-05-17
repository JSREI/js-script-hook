/**
 * 标签页项目接口
 */
export interface TabItem {
    id?: string;          // 标签页ID
    title: string;        // 标签页标题
    content: HTMLElement;  // 标签页内容
    active?: boolean;     // 是否激活
    icon?: string;        // 图标HTML
} 