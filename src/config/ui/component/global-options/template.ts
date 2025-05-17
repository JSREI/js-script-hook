import { Language } from "../language";

/**
 * 创建全局选项组件的HTML结构
 * @param language 语言配置
 * @returns 容器元素
 */
export function createGlobalOptionsContainer(language: Language): HTMLElement {
    // 创建容器
    const container = document.createElement('fieldset');
    container.className = 'global-options-fieldset';
    
    // 创建标题
    const legend = document.createElement('legend');
    legend.className = 'global-options-legend';
    legend.textContent = language.global_settings.title;
    container.appendChild(legend);
    
    // 创建表格
    const table = document.createElement('table');
    table.className = 'global-options-table';
    container.appendChild(table);
    
    return container;
} 