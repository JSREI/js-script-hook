/**
 * 文本域组件的CSS样式
 */
export const textareaStyles = `
.js-script-hook-textarea-container {
    position: relative;
    margin: 8px 0;
    width: 100%;
}

.js-script-hook-textarea-field {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 14px;
    line-height: 1.5;
    color: #606266;
    background-color: white;
    transition: border-color 0.2s ease;
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
}

.js-script-hook-textarea-field:focus {
    border-color: #409EFF;
    outline: none;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.js-script-hook-textarea-field::placeholder {
    color: #c0c4cc;
}

.js-script-hook-textarea-label {
    font-size: 14px;
    color: #606266;
    margin-bottom: 6px;
    display: block;
}

.js-script-hook-textarea-counter {
    position: absolute;
    bottom: 8px;
    right: 10px;
    font-size: 12px;
    color: #909399;
    background: rgba(255, 255, 255, 0.8);
    padding: 0 4px;
}

.js-script-hook-textarea-field.disabled {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #c0c4cc;
    cursor: not-allowed;
}
`; 