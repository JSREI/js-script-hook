/**
 * 按钮组件的CSS样式
 */
export const buttonStyles = `
.js-script-hook-button-container {
    display: inline-block;
    margin: 5px 0;
}

.js-script-hook-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 16px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    outline: none;
    border: 1px solid transparent;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 按钮尺寸 */
.js-script-hook-button.small {
    padding: 4px 12px;
    font-size: 12px;
}

.js-script-hook-button.medium {
    padding: 6px 16px;
    font-size: 14px;
}

.js-script-hook-button.large {
    padding: 8px 20px;
    font-size: 16px;
}

/* 主要按钮 */
.js-script-hook-button.primary {
    background-color: #409EFF;
    color: white;
    border-color: #409EFF;
}

.js-script-hook-button.primary:hover {
    background-color: #66b1ff;
    border-color: #66b1ff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.js-script-hook-button.primary:active {
    background-color: #3a8ee6;
    border-color: #3a8ee6;
}

/* 次要按钮 */
.js-script-hook-button.secondary {
    background-color: #f4f4f5;
    color: #606266;
    border-color: #dcdfe6;
}

.js-script-hook-button.secondary:hover {
    background-color: #e9e9eb;
    color: #409EFF;
    border-color: #c6e2ff;
}

.js-script-hook-button.secondary:active {
    background-color: #e2e2e3;
    color: #3a8ee6;
    border-color: #b3d8ff;
}

/* 危险按钮 */
.js-script-hook-button.danger {
    background-color: #f56c6c;
    color: white;
    border-color: #f56c6c;
}

.js-script-hook-button.danger:hover {
    background-color: #f78989;
    border-color: #f78989;
}

.js-script-hook-button.danger:active {
    background-color: #dd6161;
    border-color: #dd6161;
}

/* 成功按钮 */
.js-script-hook-button.success {
    background-color: #67c23a;
    color: white;
    border-color: #67c23a;
}

.js-script-hook-button.success:hover {
    background-color: #85ce61;
    border-color: #85ce61;
}

.js-script-hook-button.success:active {
    background-color: #5daf34;
    border-color: #5daf34;
}

/* 信息按钮 */
.js-script-hook-button.info {
    background-color: #909399;
    color: white;
    border-color: #909399;
}

.js-script-hook-button.info:hover {
    background-color: #a6a9ad;
    border-color: #a6a9ad;
}

.js-script-hook-button.info:active {
    background-color: #82848a;
    border-color: #82848a;
}

/* 禁用状态 */
.js-script-hook-button.disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
}

/* 带图标的按钮 */
.js-script-hook-button-icon {
    margin-right: 6px;
    display: inline-flex;
    align-items: center;
}
`; 