/**
 * 输入框组件的CSS样式
 */
export const inputStyles = `
.js-script-hook-input-container {
    position: relative;
    margin: 0;
    width: 100%;
    display: inline-block;
    vertical-align: middle;
}

.js-script-hook-input-field {
    width: 100%;
    height: 30px;
    padding: 0 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 14px;
    background-color: white;
    line-height: 28px;
    vertical-align: middle;
}

.js-script-hook-input-field:focus {
    border-color: #2196F3;
    outline: none;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
}

.js-script-hook-input-label {
    font-size: 12px;
    color: #666;
    margin-bottom: 4px;
    display: block;
}

/* 确保输入框在表格中与其他元素对齐 */
.debugger-component-table .js-script-hook-input-container {
    margin: 0;
}

.debugger-component-table .js-script-hook-input-field {
    vertical-align: middle;
}
`; 