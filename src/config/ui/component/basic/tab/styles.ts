/**
 * 标签页组件的CSS样式
 */
export const tabStyles = `
    /* 标签页容器样式 */
    .js-script-hook-tabs-container {
        width: 100%;
        margin-bottom: 20px;
    }
    
    /* 标签页头部 */
    .js-script-hook-tabs-header {
        display: flex;
        background-color: #f8f9fa;
        border-bottom: 1px solid #dee2e6;
        margin-bottom: 15px;
        border-radius: 4px 4px 0 0;
    }
    
    /* 单个标签页 */
    .js-script-hook-tab {
        padding: 10px 15px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #495057;
        border: 1px solid transparent;
        border-bottom: none;
        margin-bottom: -1px;
        border-radius: 4px 4px 0 0;
    }
    
    /* 标签页图标 */
    .js-script-hook-tab-icon {
        width: 16px;
        height: 16px;
        margin-right: 8px;
        display: inline-flex;
    }
    
    /* 标签页图标中的SVG样式 */
    .js-script-hook-tab-icon svg {
        width: 16px;
        height: 16px;
    }
    
    /* 鼠标悬停效果 */
    .js-script-hook-tab:hover {
        background-color: #f1f1f1;
        border-color: #f1f1f1 #f1f1f1 #fff;
    }
    
    /* 激活状态 */
    .js-script-hook-tab.active {
        color: #007bff;
        background-color: #fff;
        border-color: #dee2e6 #dee2e6 #fff;
        border-top: 2px solid #007bff;
        padding-top: 9px;
        font-weight: 500;
    }
    
    /* 标签页内容区域 */
    .js-script-hook-tabs-content {
        padding: 15px 0;
    }
    
    /* 单个标签页内容 */
    .js-script-hook-tab-content {
        display: none;
        animation: fadeIn 0.3s ease forwards;
    }
    
    /* 显示激活的标签页内容 */
    .js-script-hook-tab-content.active {
        display: block;
    }
    
    /* 淡入动画 */
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`; 