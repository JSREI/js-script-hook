/**
 * 提示组件的CSS样式
 */
export const tipsStyles = `
    /* 提示图标容器样式 */
    .js-script-hook-tips-icon {
        display: inline-block;
        width: 16px;
        height: 16px;
        min-width: 16px;
        min-height: 16px;
        border-radius: 50%;
        background-color: #007bff;
        color: white;
        font-size: 12px;
        font-weight: bold;
        cursor: help;
        margin-right: 5px;
        position: relative;
        vertical-align: middle;
        text-align: center;
        line-height: 16px;
    }
    
    /* 确保问号图标和后面的文本对齐 */
    .js-script-hook-tips-icon + span {
        vertical-align: middle;
    }
    
    /* 创建一个包装器，确保问号图标与文本在水平和垂直方向上对齐 */
    td[align="right"] {
        white-space: nowrap;
        vertical-align: middle;
    }
    
    td[align="right"] .js-script-hook-tips-icon,
    td[align="right"] span {
        display: inline-block;
        vertical-align: middle;
    }
    
    /* URL匹配关键字行特殊处理 - 确保这行的问号图标完美对齐 */
    [id$="-url-pattern-input-container"] {
        line-height: normal !important;
    }
    
    tr:has([id$="-url-pattern-input-container"]) td[align="right"] .js-script-hook-tips-icon {
        transform: translateY(0);
    }
    
    /* 工具提示样式 */
    .js-script-hook-tooltip {
        visibility: hidden;
        position: absolute;
        bottom: 125%;
        left: 50%;
        transform: translateX(-50%);
        background-color: #333;
        color: white;
        text-align: left;
        padding: 15px 18px;
        border-radius: 6px;
        width: max-content;
        max-width: 350px;
        min-width: 200px;
        font-size: 13px;
        z-index: 10000; /* 提高z-index确保显示在最上层 */
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.35);
        opacity: 0;
        transition: opacity 0.3s, visibility 0.3s;
        pointer-events: none;
        white-space: normal;
        line-height: 1.6;
        word-break: break-word;
        word-wrap: break-word;
        height: auto;
        overflow: visible;
        margin: 5px;
    }
    
    /* 针对超长内容的样式优化 */
    .js-script-hook-tooltip.long-content {
        max-height: 350px;
        overflow-y: auto;
    }
    
    /* 工具提示箭头 */
    .js-script-hook-tooltip::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #333 transparent transparent transparent;
    }
    
    /* 显示工具提示 */
    .js-script-hook-tips-icon:hover .js-script-hook-tooltip {
        visibility: visible;
        opacity: 1;
    }
    
    /* 提示框方向变体 - 顶部显示（默认） */
    .js-script-hook-tooltip.tooltip-top {
        bottom: 125%;
        top: auto;
    }
    .js-script-hook-tooltip.tooltip-top::after {
        top: 100%;
        bottom: auto;
        border-color: #333 transparent transparent transparent;
    }
    
    /* 提示框方向变体 - 底部显示 */
    .js-script-hook-tooltip.tooltip-bottom {
        top: 125%;
        bottom: auto;
    }
    .js-script-hook-tooltip.tooltip-bottom::after {
        bottom: 100%;
        top: auto;
        border-color: transparent transparent #333 transparent;
    }
    
    /* 提示框方向变体 - 左侧显示 */
    .js-script-hook-tooltip.tooltip-left {
        right: 125%;
        left: auto;
        top: 50%;
        bottom: auto;
        transform: translateY(-50%);
    }
    .js-script-hook-tooltip.tooltip-left::after {
        left: 100%;
        top: 50%;
        margin-left: 0;
        margin-top: -5px;
        border-color: transparent transparent transparent #333;
    }
    
    /* 提示框方向变体 - 右侧显示 */
    .js-script-hook-tooltip.tooltip-right {
        left: 125%;
        right: auto;
        top: 50%;
        bottom: auto;
        transform: translateY(-50%);
    }
    .js-script-hook-tooltip.tooltip-right::after {
        right: 100%;
        left: auto;
        top: 50%;
        margin-top: -5px;
        border-color: transparent #333 transparent transparent;
    }
    
    /* 响应式处理长文本 */
    @media screen and (max-width: 768px) {
        .js-script-hook-tooltip {
            max-width: 300px;
        }
    }
`; 