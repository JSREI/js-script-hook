/**
 * 调试器组件的CSS样式
 */
export const debuggerStyles = `
.debugger-component-fieldset {
    width: 780px;
    border: 1px solid #ddd;
    border-radius: 6px;
    margin: 15px 0;
    padding: 15px;
    position: relative;
    background-color: #fcfcfc;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    transition: box-shadow 0.2s ease;
}

.debugger-component-fieldset:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.debugger-component-legend {
    color: #666;
    font-weight: 500;
    padding: 0 10px;
    font-size: 14px;
}

.debugger-component-remove-btn {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #aaa;
    background-color: white;
    border-radius: 50%;
    font-size: 14px;
    color: #888;
    cursor: pointer;
    transition: all 0.2s ease;
    opacity: 0.7;
}

.debugger-component-remove-btn:hover {
    color: #555;
    background-color: #f5f5f5;
    border-color: #777;
    opacity: 1;
}

.debugger-component-table {
    width: 100%;
    border-spacing: 0;
    border-collapse: separate;
    table-layout: fixed;
}

.debugger-component-table tr {
    min-height: 38px;
    height: auto;
    vertical-align: middle;
}

.debugger-component-table td {
    padding: 6px 8px;
    vertical-align: middle;
}

.debugger-component-table td[align="right"] {
    width: 300px;
    text-align: right;
    padding-right: 15px;
    white-space: normal;
}

.debugger-component-table td[align="left"] {
    text-align: left;
    padding-left: 15px;
}

/* 确保按钮和输入框在同一行内垂直居中 */
.debugger-component-table td > * {
    vertical-align: middle;
}

/* 确保测试按钮与问号图标对齐 */
.js-script-hook-button-container {
    display: inline-block;
    vertical-align: middle;
    margin: 0;
}

/* 调整输入框的高度，使其与行高匹配 */
.js-script-hook-input-field {
    box-sizing: border-box;
    height: 30px;
    line-height: 28px;
    padding: 0 10px;
}

/* Tips和标签布局容器 */
.tips-label-container {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    min-height: 26px;
    gap: 4px;
}

/* Tips容器样式 */
.tip-container {
    display: inline-block;
    flex-shrink: 0;
    margin-right: 0;
    width: 16px;
    height: 16px;
}

/* 标签文本样式 */
.label-text {
    display: inline-block;
    vertical-align: middle;
    word-break: break-word;
    line-height: 1.3;
    padding-top: 1px;
}

/* 原生问号样式覆盖，避免与tips冲突 */
.breakpoint-question-mark {
    display: none !important;
}

/* 隐藏ServerGo界面的原生问号标记 */
.breakpoint-configuration .questionmark {
    display: none !important;
}

/* 隐藏任何出现在我们组件外围的问号 */
.js-script-hook-debugger-list > div > .questionmark,
.breakpoint-configuration > .questionmark,
#js-script-hook-debugger-list ~ .questionmark,
.debugger-component-fieldset ~ .questionmark {
    display: none !important;
}

/* 隐藏任何问号字符 */
.js-script-hook-debugger-list .questionmark,
#js-script-hook-debugger-list .questionmark {
    display: none !important;
}

/* 可能的通用类，隐藏所有原生问号 */
.js-script-hook-modal .questionmark,
.js-script-hook-modal-content .questionmark {
    display: none !important;
}

/* 增强问号隐藏规则 */
.js-script-hook-modal *[class*="uestion"],
.breakpoint-configuration *[class*="uestion"] {
    display: none !important;
}

/* 针对箭头指向的问号 */
.breakpoint-configuration > * > .questionmark {
    display: none !important;
}

/* 修复ServerGo断点配置界面的布局问题 */
.breakpoint-configuration {
    /* 确保内容不超出容器 */
    max-width: 100%;
}

/* 调整实际界面中的问号与标签对齐 */
.breakpoint-configuration td:first-child {
    width: 10px !important;
    padding-right: 4px !important;
    white-space: nowrap;
}

/* 使标签靠近问号 */
.breakpoint-configuration td[align="right"],
.breakpoint-configuration td:nth-child(2) {
    text-align: left !important;
    padding-left: 5px !important;
    width: auto !important;
}

/* 直接针对红框中的JSONP回调函数布局问题 */
.breakpoint-configuration tr:nth-child(6) td,
.breakpoint-configuration tr:nth-child(6) td * {
    vertical-align: top !important;
    display: inline-block;
}

/* 强制所有标签左对齐 */
.breakpoint-configuration table tr td {
    text-align: left !important;
}
`; 