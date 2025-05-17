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
    height: 38px;
    vertical-align: middle;
}

.debugger-component-table td {
    padding: 6px 8px;
    vertical-align: middle;
}

.debugger-component-table td[align="right"] {
    width: 200px;
    text-align: right;
    padding-right: 15px;
    white-space: nowrap;
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
`; 