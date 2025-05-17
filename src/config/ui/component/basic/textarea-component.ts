/**
 * 文本域组件 - 原生JavaScript实现
 */

export class TextareaComponent {
    private readonly styleCSS: string;
    
    constructor() {
        this.styleCSS = `
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
    }
    
    /**
     * 添加组件样式到页面中
     */
    private appendStyles(): void {
        // 避免重复插入
        if (document.getElementById("textarea-component-style")) {
            return;
        }
        
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "textarea-component-style";
        style.appendChild(document.createTextNode(this.styleCSS));
        document.head.appendChild(style);
    }
    
    /**
     * 渲染文本域组件
     * @param id 文本域ID
     * @param value 初始值
     * @param placeholder 占位符
     * @param label 标签文本（可选）
     * @param onChange 值变更回调（可选）
     * @param rows 行数（可选，默认5）
     * @param maxLength 最大长度（可选，如果提供则显示计数器）
     * @param disabled 是否禁用
     * @returns HTMLElement
     */
    render(
        id: string, 
        value: string = '', 
        placeholder: string = '',
        label?: string,
        onChange?: (value: string) => void,
        rows: number = 5,
        maxLength?: number,
        disabled: boolean = false
    ): HTMLElement {
        // 确保样式已添加
        this.appendStyles();
        
        // 创建文本域容器
        const container = document.createElement('div');
        container.className = 'js-script-hook-textarea-container';
        
        // 如果有标签，添加标签
        if (label) {
            const labelElement = document.createElement('label');
            labelElement.className = 'js-script-hook-textarea-label';
            labelElement.setAttribute('for', id);
            labelElement.textContent = label;
            container.appendChild(labelElement);
        }
        
        // 创建文本域元素
        const textarea = document.createElement('textarea');
        textarea.id = id;
        textarea.className = `js-script-hook-textarea-field${disabled ? ' disabled' : ''}`;
        textarea.placeholder = placeholder;
        textarea.rows = rows;
        textarea.value = value;
        
        if (maxLength) {
            textarea.maxLength = maxLength;
        }
        
        if (disabled) {
            textarea.disabled = true;
        }
        
        // 添加到容器
        container.appendChild(textarea);
        
        // 如果设置了最大长度，添加计数器
        if (maxLength) {
            const counter = document.createElement('span');
            counter.className = 'js-script-hook-textarea-counter';
            counter.textContent = `${value.length}/${maxLength}`;
            container.appendChild(counter);
            
            textarea.addEventListener('input', () => {
                const currentLength = textarea.value.length;
                counter.textContent = `${currentLength}/${maxLength}`;
            });
        }
        
        // 添加事件处理
        if (onChange) {
            textarea.addEventListener('input', (e) => {
                const target = e.target as HTMLTextAreaElement;
                onChange(target.value);
            });
        }
        
        return container;
    }
} 