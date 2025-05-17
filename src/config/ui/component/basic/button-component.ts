import $ from 'jquery';

export type ButtonType = 'primary' | 'secondary' | 'danger' | 'success' | 'info';
export type ButtonSize = 'small' | 'medium' | 'large';

export class ButtonComponent {
    private readonly styleCSS: string;
    
    constructor() {
        this.styleCSS = `
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
    }
    
    /**
     * 添加组件样式到页面
     */
    private appendStyles(): void {
        // 避免重复插入
        if (document.getElementById("button-component-style")) {
            return;
        }
        
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "button-component-style";
        style.appendChild(document.createTextNode(this.styleCSS));
        document.head.appendChild(style);
    }
    
    /**
     * 渲染按钮组件
     * @param id 按钮ID
     * @param text 按钮文本
     * @param onClick 点击事件回调
     * @param type 按钮类型
     * @param size 按钮大小
     * @param icon 按钮图标（可选HTML字符串）
     * @param disabled 是否禁用
     * @returns jQuery对象
     */
    render(
        id: string,
        text: string,
        onClick: (e: JQuery.ClickEvent) => void,
        type: ButtonType = 'primary',
        size: ButtonSize = 'medium',
        icon?: string,
        disabled: boolean = false
    ): JQuery<HTMLElement> {
        // 确保样式已添加
        this.appendStyles();
        
        // 创建按钮容器
        const container = $('<div class="js-script-hook-button-container"></div>');
        
        // 创建按钮HTML
        let buttonContent = '';
        if (icon) {
            buttonContent += `<span class="js-script-hook-button-icon">${icon}</span>`;
        }
        buttonContent += text;
        
        // 创建按钮元素
        const button = $(`<button id="${id}" class="js-script-hook-button ${type} ${size}${disabled ? ' disabled' : ''}">${buttonContent}</button>`);
        
        // 添加点击事件
        if (!disabled) {
            button.on('click', onClick);
        }
        
        // 添加到容器并返回
        container.append(button);
        return container;
    }
} 