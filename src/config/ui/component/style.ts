const css = `
/* 全局样式 */
.js-script-hook-container {
    font-family: Arial, sans-serif;
    color: #333;
    line-height: 1.6;
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
}

/* 标题样式 */
.js-script-hook-container h1 {
    color: #2c3e50;
    font-size: 24px;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #eee;
}

.js-script-hook-container h2 {
    color: #34495e;
    font-size: 20px;
    margin: 15px 0;
}

/* 表单元素样式 */
.js-script-hook-container input[type="text"],
.js-script-hook-container input[type="number"],
.js-script-hook-container textarea,
.js-script-hook-container select {
    width: 100%;
    padding: 8px;
    margin: 5px 0;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
}

.js-script-hook-container textarea {
    min-height: 100px;
    resize: vertical;
}

/* 复选框和单选框样式 */
.js-script-hook-container input[type="checkbox"],
.js-script-hook-container input[type="radio"] {
    margin-right: 5px;
}

/* 按钮样式 */
.js-script-hook-container button {
    background-color: #3498db;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 5px;
    transition: background-color 0.3s;
}

.js-script-hook-container button:hover {
    background-color: #2980b9;
}

.js-script-hook-container button.danger {
    background-color: #e74c3c;
}

.js-script-hook-container button.danger:hover {
    background-color: #c0392b;
}

/* 表格样式 */
.js-script-hook-container table {
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0;
}

.js-script-hook-container th,
.js-script-hook-container td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: left;
}

.js-script-hook-container th {
    background-color: #f8f9fa;
    font-weight: bold;
}

/* 提示文本样式 */
.js-script-hook-container .tip {
    color: #666;
    font-size: 14px;
    margin: 5px 0;
}

/* 错误消息样式 */
.js-script-hook-container .error {
    color: #e74c3c;
    font-size: 14px;
    margin: 5px 0;
}

/* 成功消息样式 */
.js-script-hook-container .success {
    color: #27ae60;
    font-size: 14px;
    margin: 5px 0;
}

/* 分隔线样式 */
.js-script-hook-container hr {
    border: none;
    border-top: 1px solid #eee;
    margin: 20px 0;
}

/* 标签样式 */
.js-script-hook-container label {
    display: block;
    margin: 10px 0 5px;
    color: #2c3e50;
    font-weight: bold;
}

/* 开关样式 */
.js-script-hook-container .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
}

.js-script-hook-container .switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.js-script-hook-container .slider {
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

.js-script-hook-container .slider:before {
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

.js-script-hook-container input:checked + .slider {
    background-color: #2196F3;
}

.js-script-hook-container input:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
}

.js-script-hook-container input:checked + .slider:before {
    transform: translateX(26px);
}

/* 响应式布局 */
@media (max-width: 600px) {
    .js-script-hook-container {
        padding: 10px;
    }

    .js-script-hook-container button {
        width: 100%;
        margin: 5px 0;
    }
}

/* 工具提示样式 */
.js-script-hook-container .tooltip {
    position: relative;
    display: inline-block;
}

.js-script-hook-container .tooltip .tooltip-text {
    visibility: hidden;
    width: 200px;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    margin-left: -100px;
    opacity: 0;
    transition: opacity 0.3s;
}

.js-script-hook-container .tooltip:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
}

/* 卡片样式 */
.js-script-hook-container .card {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 15px;
    margin: 10px 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 徽章样式 */
.js-script-hook-container .badge {
    display: inline-block;
    padding: 3px 7px;
    font-size: 12px;
    font-weight: bold;
    line-height: 1;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 10px;
    background-color: #3498db;
}

/* 警告样式 */
.js-script-hook-container .warning {
    background-color: #fff3cd;
    border: 1px solid #ffeeba;
    color: #856404;
    padding: 10px;
    border-radius: 4px;
    margin: 10px 0;
}

/* 信息样式 */
.js-script-hook-container .info {
    background-color: #d1ecf1;
    border: 1px solid #bee5eb;
    color: #0c5460;
    padding: 10px;
    border-radius: 4px;
    margin: 10px 0;
}
`;

/**
 * 把当前hook需要用到的样式表追加到页面中
 */
export function appendScriptHookStyleToCurrentPage(): void {
    // 避免重复插入
    if (document.getElementById("js-script-hook-style")) {
        return;
    }

    // 创建一个 <style> 元素
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = "js-script-hook-style";

    // 将 CSS 规则添加到 <style> 元素
    if ((style as any).styleSheet) {
        // 兼容 IE8 及以下
        (style as any).styleSheet.cssText = css;
    } else {
        // 现代浏览器
        style.appendChild(document.createTextNode(css));
    }

    // 将 <style> 元素插入到 <head> 中
    document.head.appendChild(style);
} 