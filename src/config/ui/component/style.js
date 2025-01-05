// 定义要添加的 CSS 规则
const css = `

        /* ================================== 最外边的窗口 ================================== */
        
        /* 容器 div */
        .js-script-hook-scrollable-div {
            max-height: 100vh; /* 最大高度等于视口高度 */
            overflow-y: auto; /* 超出时显示垂直滚动条 */
            border: 2px solid #4CAF50;
            padding: 20px;
            box-sizing: border-box; /* 确保 padding 和 border 不增加总高度 */
        }
        
        /* ================================== 输入框 ================================== */

        /* 输入框样式 */
        .js-script-hook-input[type="text"] {
            flex: 1;
            width: 100%;
            padding: 5px;
            margin-bottom: 15px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 15px;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
            outline: none;
        }

        /* 输入框聚焦效果 */
        .js-script-hook-input[type="text"]:focus {
            border-color: #4CAF50;
            box-shadow: 0 0 8px rgba(76, 175, 80, 0.3);
        }
        
        /* ================================== 按钮 ================================== */

        /* 按钮样式 */
        .js-script-hook-button {
            background-color: #4CAF50;
            color: white;
            padding: 3px 12px;
            border: none;
            border-radius: 5px;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.2s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        /* 按钮悬停效果 */
        .js-script-hook-button:hover {
            background-color: #45a049;
            transform: translateY(-2px);
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
        }

        /* 按钮点击效果 */
        js-script-hook-button:active {
            background-color: #3d8b40;
            transform: translateY(0);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        /* 禁用按钮样式 */
        .js-script-hook-button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
            opacity: 0.7;
        }
        
        
        /* ================================== 复选框 ================================== */
        
        /* 隐藏原生复选框 */
        .js-script-hook-input[type="checkbox"] {
            display: none;
        }

        /* 自定义复选框的容器 */
        .js-script-hook-checkbox-container {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            cursor: pointer;
        }

        /* 自定义复选框的外观 */
        .js-script-hook-checkbox-container .js-script-hook-custom-checkbox {
            width: 20px;
            height: 20px;
            border: 2px solid #ccc;
            border-radius: 4px;
            margin-right: 10px;
            position: relative;
            transition: background-color 0.3s ease, border-color 0.3s ease;
        }

        /* 复选框选中时的样式 */
        .js-script-hook-input[type="checkbox"]:checked + .js-script-hook-custom-checkbox {
            background-color: #4CAF50;
            border-color: #4CAF50;
        }

        /* 复选框选中时的对勾图标 */
        .js-script-hook-input[type="checkbox"]:checked + .js-script-hook-custom-checkbox::after {
            content: '';
            position: absolute;
            left: 6px;
            top: 2px;
            width: 5px;
            height: 10px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
        }

        /* 悬停效果 */
        .js-script-hook-checkbox-container:hover .js-script-hook-custom-checkbox {
            border-color: #4CAF50;
        }

        /* 禁用状态 */
        .js-script-hook-input[type="checkbox"]:disabled + .js-script-hook-custom-checkbox {
            background-color: #f0f0f0;
            border-color: #ccc;
            cursor: not-allowed;
        }

        .js-script-hook-input[type="checkbox"]:disabled:checked + .js-script-hook-custom-checkbox {
            background-color: #ccc;
        }
        
        /* ================================== 下拉框 ================================== */
        
        /* 下拉框容器 */
        .js-script-hook-select-container {
            position: relative;
            width: 200px;
        }

        /* 美化下拉框 */
        .js-script-hook-select-container select {
            width: 100%;
            padding: 5px;
            font-size: 15px;
            border: 2px solid #ccc;
            border-radius: 5px;
            background-color: white;
            appearance: none; /* 隐藏默认箭头 */
            -webkit-appearance: none; /* 兼容 Safari */
            -moz-appearance: none; /* 兼容 Firefox */
            cursor: pointer;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        /* 自定义下拉箭头 */
        .js-script-hook-select-container::after {
            content: '▼';
            position: absolute;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            pointer-events: none; /* 防止点击箭头时触发下拉框 */
            color: #666;
            font-size: 12px;
        }

        /* 悬停效果 */
        .js-script-hook-select-container select:hover {
            border-color: #4CAF50;
        }

        /* 聚焦效果 */
        .js-script-hook-select-container select:focus {
            border-color: #4CAF50;
            box-shadow: 0 0 8px rgba(76, 175, 80, 0.3);
            outline: none;
        }

        /* 禁用状态 */
        .js-script-hook-select-container select:disabled {
            background-color: #f0f0f0;
            cursor: not-allowed;
            opacity: 0.7;
        }
        /* ================================== 问号提示 ================================== */

        /* 问号图标 */
        .js-script-hook-tips-icon {
            display: inline-block;
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            background-color: #DDD;
            color: white;
            border-radius: 50%;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            position: relative;
        }
        
        /* 提示信息 */
        .js-script-hook-tips-icon .js-script-hook-tooltip {
            visibility: hidden;
            opacity: 0;
            width: 500px;
            background-color: #333;
            color: white;
            text-align: left;
            border-radius: 5px;
            padding: 10px;
            position: absolute;
            z-index: 2147483647;
            bottom: 50%; /* 提示信息垂直居中 */
            left: 125%; /* 提示信息位于问号右侧 */
            transform: translateY(50%); /* 垂直居中 */
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        
        /* 提示信息箭头 */
        .js-script-hook-tips-icon .js-script-hook-tooltip::after {
            content: '';
            position: absolute;
            top: 50%;
            left: -5px; /* 箭头位于提示信息的左侧 */
            margin-top: -5px; /* 垂直居中 */
            border-width: 5px;
            border-style: solid;
            border-color: transparent #333 transparent transparent; /* 箭头指向左侧 */
        }
        
        /* 鼠标悬停时显示提示信息 */
        .js-script-hook-tips-icon:hover .js-script-hook-tooltip {
            visibility: visible;
            opacity: 1;
        }
        
        /* ================================== 多行文本框 ================================== */
        
        /* 美化 Textarea */
        .js-script-hook-textarea {
            width: 100%;
            height: 150px;
            padding: 12px;
            font-size: 16px;
            border: 2px solid #ccc;
            border-radius: 8px;
            background-color: #f9f9f9;
            resize: vertical; /* 允许垂直调整大小 */
            outline: none;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        /* 悬停效果 */
        .js-script-hook-textarea:hover {
            border-color: #4CAF50;
        }

        /* 聚焦效果 */
        .js-script-hook-textarea:focus {
            border-color: #4CAF50;
            box-shadow: 0 0 8px rgba(76, 175, 80, 0.3);
        }

        /* 禁用状态 */
        .js-script-hook-textarea:disabled {
            background-color: #f0f0f0;
            cursor: not-allowed;
            opacity: 0.7;
        }
        
`;

/**
 * 把当前hook需要用到的样式表追加到页面中
 */
function appendScriptHookStyleToCurrentPage() {

    // 避免重复插入
    if ($("#js-script-hook-style").length > 0) {
        return;
    }

    // 创建一个 <style> 元素
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = "js-script-hook-style";

    // 将 CSS 规则添加到 <style> 元素
    if (style.styleSheet) {
        // 兼容 IE8 及以下
        style.styleSheet.cssText = css;
    } else {
        // 现代浏览器
        style.appendChild(document.createTextNode(css));
    }

    // 将 <style> 元素插入到 <head> 中
    document.head.appendChild(style);
}

module.exports = {
    appendScriptHookStyleToCurrentPage
}
