import $ from 'jquery';

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
     * @returns jQuery对象
     */
    render(
        id: string, 
        options: SelectOption[],
        selectedValue: string = '',
        label?: string,
        onChange?: (value: string) => void
    ): JQuery<HTMLElement> {
        // 确保样式已添加
        this.appendStyles();
        
        // 为了确保ID唯一性，给id添加一个唯一标识符
        const uniqueId = id || SelectComponent.generateId();
        
        // 创建选择框容器
        const container = $('<div class="js-script-hook-select-container"></div>');
        
        // 如果有标签，添加标签
        if (label) {
            container.append(`<label class="js-script-hook-select-label" for="${uniqueId}">${label}</label>`);
        }
        
        // 查找默认选中的文本
        const selectedOption = options.find(opt => opt.value === selectedValue) || options[0];
        const selectedText = selectedOption ? selectedOption.text : '';
        
        // 创建自定义下拉框HTML结构
        const customSelect = $('<div class="js-script-hook-custom-select"></div>');
        
        // 选中的选项显示区域
        const selectedDiv = $(`<div class="js-script-hook-selected-option" data-value="${selectedValue || ''}">
            <span class="js-script-hook-selected-text">${selectedText}</span>
            <span class="js-script-hook-select-arrow">▼</span>
        </div>`);
        
        // 选项列表容器
        const optionsContainer = $('<div class="js-script-hook-options-container"></div>');
        
        // 添加选项
        options.forEach(option => {
            const isSelected = option.value === selectedValue;
            const optionElement = $(`<div class="js-script-hook-option${isSelected ? ' selected' : ''}" data-value="${option.value}">
                ${option.text}
            </div>`);
            
            // 点击选项时更新选中状态
            optionElement.on('click', function() {
                const value = $(this).data('value') as string;
                const text = $(this).text().trim();
                
                // 更新显示的文本和值
                selectedDiv.find('.js-script-hook-selected-text').text(text);
                selectedDiv.attr('data-value', value);
                
                // 更新选项的选中状态
                optionsContainer.find('.js-script-hook-option').removeClass('selected');
                $(this).addClass('selected');
                
                // 更新隐藏的原生select
                nativeSelect.val(value);
                
                // 关闭下拉列表
                optionsContainer.removeClass('open');
                selectedDiv.removeClass('active');
                selectedDiv.find('.js-script-hook-select-arrow').removeClass('open');
                
                // 触发onChange回调
                if (onChange) {
                    onChange(value);
                }
                
                // 阻止事件冒泡
                return false;
            });
            
            optionsContainer.append(optionElement);
        });
        
        // 创建隐藏的原生select，用于表单提交和键盘导航
        const nativeSelect = $(`<select id="${uniqueId}" class="js-script-hook-select-native"></select>`);
        options.forEach(option => {
            const selected = option.value === selectedValue ? 'selected' : '';
            nativeSelect.append(`<option value="${option.value}" ${selected}>${option.text}</option>`);
        });
        
        // 点击选中区域显示/隐藏选项列表
        selectedDiv.on('click', function(e) {
            e.stopPropagation();
            const isOpen = optionsContainer.hasClass('open');
            
            // 关闭所有其他打开的下拉列表
            $('.js-script-hook-options-container.open').removeClass('open');
            $('.js-script-hook-selected-option.active').removeClass('active');
            $('.js-script-hook-select-arrow.open').removeClass('open');
            
            // 切换当前下拉列表的显示状态
            if (isOpen) {
                optionsContainer.removeClass('open');
                selectedDiv.removeClass('active');
                selectedDiv.find('.js-script-hook-select-arrow').removeClass('open');
            } else {
                optionsContainer.addClass('open');
                selectedDiv.addClass('active');
                selectedDiv.find('.js-script-hook-select-arrow').addClass('open');
            }
        });
        
        // 点击页面其他区域关闭下拉列表
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.js-script-hook-custom-select').length) {
                optionsContainer.removeClass('open');
                selectedDiv.removeClass('active');
                selectedDiv.find('.js-script-hook-select-arrow').removeClass('open');
            }
        });
        
        // 组装组件
        customSelect.append(selectedDiv).append(optionsContainer);
        container.append(customSelect).append(nativeSelect);
        
        // 设置原生select的onChange事件
        if (onChange) {
            nativeSelect.on('change', function() {
                const value = $(this).val() as string;
                onChange(value);
            });
        }
        
        return container;
    }
} 