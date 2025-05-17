/**
 * 下拉选择框组件 - 原生JavaScript实现
 */

export type SelectOption = {
    value: string;
    text: string;
};

export class SelectComponent {
    private readonly styleCSS: string;
    private static idCounter: number = 0;
    
    constructor() {
        this.styleCSS = `
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
    }
    
    /**
     * 添加组件样式到页面
     */
    private appendStyles(): void {
        // 避免重复插入
        if (document.getElementById("select-component-style")) {
            return;
        }
        
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "select-component-style";
        style.appendChild(document.createTextNode(this.styleCSS));
        document.head.appendChild(style);
    }
    
    /**
     * 生成唯一ID
     */
    private static generateId(): string {
        return `js-script-hook-select-${++SelectComponent.idCounter}`;
    }
    
    /**
     * 渲染下拉选择框组件
     * @param id 选择框ID
     * @param options 选项列表
     * @param selectedValue 选中的值
     * @param label 标签文本（可选）
     * @param onChange 值变更回调（可选）
     * @returns HTMLElement
     */
    render(
        id: string, 
        options: SelectOption[],
        selectedValue: string = '',
        label?: string,
        onChange?: (value: string) => void
    ): HTMLElement {
        // 确保样式已添加
        this.appendStyles();
        
        // 为了确保ID唯一性，给id添加一个唯一标识符
        const uniqueId = id || SelectComponent.generateId();
        
        // 创建选择框容器
        const container = document.createElement('div');
        container.className = 'js-script-hook-select-container';
        
        // 如果有标签，添加标签
        if (label) {
            const labelElement = document.createElement('label');
            labelElement.className = 'js-script-hook-select-label';
            labelElement.setAttribute('for', uniqueId);
            labelElement.textContent = label;
            container.appendChild(labelElement);
        }
        
        // 查找默认选中的文本
        const selectedOption = options.find(opt => opt.value === selectedValue) || options[0];
        const selectedText = selectedOption ? selectedOption.text : '';
        
        // 创建自定义下拉框结构
        const customSelect = document.createElement('div');
        customSelect.className = 'js-script-hook-custom-select';
        
        // 选中的选项显示区域
        const selectedDiv = document.createElement('div');
        selectedDiv.className = 'js-script-hook-selected-option';
        selectedDiv.setAttribute('data-value', selectedValue || '');
        
        const selectedTextSpan = document.createElement('span');
        selectedTextSpan.className = 'js-script-hook-selected-text';
        selectedTextSpan.textContent = selectedText;
        
        const arrowSpan = document.createElement('span');
        arrowSpan.className = 'js-script-hook-select-arrow';
        arrowSpan.textContent = '▼';
        
        selectedDiv.appendChild(selectedTextSpan);
        selectedDiv.appendChild(arrowSpan);
        
        // 选项列表容器
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'js-script-hook-options-container';
        
        // 添加选项
        options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = `js-script-hook-option${option.value === selectedValue ? ' selected' : ''}`;
            optionElement.setAttribute('data-value', option.value);
            optionElement.textContent = option.text;
            
            // 添加点击事件
            optionElement.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // 更新选中状态
                const allOptions = optionsContainer.querySelectorAll('.js-script-hook-option');
                allOptions.forEach(opt => opt.classList.remove('selected'));
                optionElement.classList.add('selected');
                
                // 更新显示的文本
                selectedTextSpan.textContent = option.text;
                selectedDiv.setAttribute('data-value', option.value);
                
                // 关闭选项列表
                optionsContainer.classList.remove('open');
                selectedDiv.classList.remove('active');
                arrowSpan.classList.remove('open');
                
                // 触发onChange回调
                if (onChange) {
                    onChange(option.value);
                }
            });
            
            optionsContainer.appendChild(optionElement);
        });
        
        // 添加点击事件以显示/隐藏选项列表
        selectedDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = optionsContainer.classList.contains('open');
            
            if (!isOpen) {
                // 关闭其他所有打开的选择框
                document.querySelectorAll('.js-script-hook-options-container.open').forEach(container => {
                    container.classList.remove('open');
                    const parentSelect = container.closest('.js-script-hook-custom-select');
                    if (parentSelect) {
                        const selectedOption = parentSelect.querySelector('.js-script-hook-selected-option');
                        const arrow = parentSelect.querySelector('.js-script-hook-select-arrow');
                        if (selectedOption) selectedOption.classList.remove('active');
                        if (arrow) arrow.classList.remove('open');
                    }
                });
            }
            
            // 切换当前选择框的状态
            optionsContainer.classList.toggle('open');
            selectedDiv.classList.toggle('active');
            arrowSpan.classList.toggle('open');
        });
        
        // 点击外部关闭选项列表
        document.addEventListener('click', () => {
            optionsContainer.classList.remove('open');
            selectedDiv.classList.remove('active');
            arrowSpan.classList.remove('open');
        });
        
        // 组装组件
        customSelect.appendChild(selectedDiv);
        customSelect.appendChild(optionsContainer);
        container.appendChild(customSelect);
        
        return container;
    }
} 