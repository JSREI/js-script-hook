/**
 * 输入框组件 - 原生JavaScript实现
 */

export class InputComponent {
    private readonly styleCSS: string;
    
    constructor() {
        this.styleCSS = `
        .js-script-hook-input-container {
            position: relative;
            margin: 8px 0;
            width: 100%;
        }
        
        .js-script-hook-input-field {
            width: 100%;
            padding: 8px 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 14px;
            background-color: white;
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
        `;
    }
    
    /**
     * 添加组件样式到页面
     */
    private appendStyles(): void {
        // 避免重复插入
        if (document.getElementById("input-component-style")) {
            return;
        }
        
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "input-component-style";
        style.appendChild(document.createTextNode(this.styleCSS));
        document.head.appendChild(style);
    }
    
    /**
     * 渲染输入框组件
     * @param id 输入框ID
     * @param value 初始值
     * @param placeholder 占位符
     * @param label 标签文本（可选）
     * @param onChange 值变更回调（可选）
     * @returns HTMLElement
     */
    render(
        id: string, 
        value: string = '', 
        placeholder: string = '',
        label?: string,
        onChange?: (value: string) => void
    ): HTMLElement {
        // 确保样式已添加
        this.appendStyles();
        
        // 创建容器元素
        const container = document.createElement('div');
        container.className = 'js-script-hook-input-container';
        
        // 如果有标签，创建标签元素
        if (label) {
            const labelElement = document.createElement('label');
            labelElement.className = 'js-script-hook-input-label';
            labelElement.setAttribute('for', id);
            labelElement.textContent = label;
            container.appendChild(labelElement);
        }
        
        // 创建输入框元素
        const input = document.createElement('input');
        input.id = id;
        input.className = 'js-script-hook-input-field';
        input.type = 'text';
        input.value = value;
        input.placeholder = placeholder;
        
        // 添加事件处理
        if (onChange) {
            input.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement;
                onChange(target.value);
            });
        }
        
        container.appendChild(input);
        
        return container;
    }
} 