/**
 * 复选框组件的CSS样式
 */
export const checkboxStyles = `
/* 复选框容器样式 */
.js-script-hook-checkbox-container {
    position: relative;
    display: inline-block;
    width: 20px;
    height: 20px;
    cursor: pointer;
}

.js-script-hook-custom-checkbox {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 3px;
    position: absolute;
    top: 0;
    left: 0;
}

.js-script-hook-checkbox-container input:checked + .js-script-hook-custom-checkbox:after {
    content: "✓";
    position: absolute;
    top: 0;
    left: 5px;
    color: #2196F3;
    font-weight: bold;
}

/* 开关样式 */
.js-script-hook-switch-container {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
}

.js-script-hook-switch-container input {
    opacity: 0;
    width: 0;
    height: 0;
}

.js-script-hook-switch-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;
}

.js-script-hook-switch-slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

.js-script-hook-switch-container input:checked + .js-script-hook-switch-slider {
    background-color: #2196F3;
}

.js-script-hook-switch-container input:checked + .js-script-hook-switch-slider:before {
    transform: translateX(26px);
}

/* 标签样式 */
.js-script-hook-checkbox-label {
    margin-left: 8px;
    font-size: 14px;
    color: #333;
    cursor: pointer;
}
`; 