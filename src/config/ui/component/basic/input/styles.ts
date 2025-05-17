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

/* 禁用状态的输入框样式 */
.js-script-hook-input-field:disabled {
    background-color: #f2f2f2;
    color: #999;
    border-color: #ddd;
    cursor: not-allowed;
    opacity: 0.7;
    box-shadow: none;
    background-image: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        rgba(0, 0, 0, 0.03) 10px,
        rgba(0, 0, 0, 0.03) 20px
    );
    text-decoration: line-through;
    font-style: italic;
}

.js-script-hook-input-field:disabled::placeholder {
    color: #aaa;
    text-decoration: line-through;
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
    vertical-align: middle;
}

.debugger-component-table .js-script-hook-input-field {
    vertical-align: middle;
}

/* 特别处理URL匹配关键字输入框 */
[id$="-url-pattern-input-container"] .js-script-hook-input-container {
    display: inline-flex;
    align-items: center;
}

[id$="-url-pattern-input-container"] .js-script-hook-input-field {
    height: 32px;
}

/* 确保输入框placeholder不影响高度 */
.js-script-hook-input-field::placeholder {
    line-height: normal;
}
`; 