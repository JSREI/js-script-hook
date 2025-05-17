/**
 * 选择框组件的CSS样式
 */
export const selectStyles = `
.js-script-hook-select-container {
    position: relative;
    margin: 8px 0;
    width: 100%;
}

.js-script-hook-select-label {
    font-size: 13px;
    font-weight: 500;
    color: #606266;
    margin-bottom: 6px;
    display: block;
}

.js-script-hook-custom-select {
    position: relative;
    width: 100%;
    cursor: pointer;
}

.js-script-hook-selected-option {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #dcdfe6;
    border-radius: 6px;
    box-sizing: border-box;
    font-size: 14px;
    color: #333;
    background-color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.js-script-hook-selected-option:hover {
    border-color: #c0c4cc;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.js-script-hook-selected-option.active {
    border-color: #409EFF;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.js-script-hook-selected-text {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.js-script-hook-select-arrow {
    color: #409EFF;
    margin-left: 8px;
    transition: transform 0.3s;
}

.js-script-hook-select-arrow.open {
    transform: rotate(180deg);
}

.js-script-hook-options-container {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
    background-color: white;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    margin-top: 5px;
    z-index: 1000;
    display: none;
}

.js-script-hook-options-container.open {
    display: block;
}

.js-script-hook-option {
    padding: 10px 12px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.js-script-hook-option:hover {
    background-color: #f5f7fa;
}

.js-script-hook-option.selected {
    background-color: #ecf5ff;
    color: #409EFF;
    font-weight: 500;
}

/* 隐藏原生select */
.js-script-hook-select-native {
    position: absolute;
    opacity: 0;
    pointer-events: none;
    height: 0;
    width: 0;
    overflow: hidden;
}
`; 