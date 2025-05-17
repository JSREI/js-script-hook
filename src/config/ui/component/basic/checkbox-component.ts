import { jQuery as $, JQuery } from '../utils/jquery-adapter';

export type CheckboxType = 'checkbox' | 'switch';

export class CheckboxComponent {
    private readonly styleCSS: string;
    
    constructor() {
        this.styleCSS = `
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
        `;
    }
    
    /**
     * 添加组件样式到页面
     */
    private appendStyles(): void {
        // 避免重复插入
        if (document.getElementById("checkbox-component-style")) {
            return;
        }
        
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "checkbox-component-style";
        style.appendChild(document.createTextNode(this.styleCSS));
        document.head.appendChild(style);
    }
    
    /**
     * 渲染复选框或开关组件
     * @param id 复选框ID
     * @param isChecked 是否选中
     * @param onChange 改变事件回调
     * @param type 组件类型：'checkbox'为标准复选框，'switch'为滑动开关
     * @returns jQuery对象
     */
    render(
        id: string, 
        isChecked: boolean, 
        onChange?: (isChecked: boolean) => void,
        type: CheckboxType = 'checkbox'
    ): JQuery<HTMLElement> {
        // 确保样式已添加
        this.appendStyles();
        
        // 创建HTML
        let html;
        
        if (type === 'switch') {
            // 创建开关样式HTML
            html = `
                <label class="js-script-hook-switch-container">
                    <input id="${id}" type="checkbox" ${isChecked ? "checked='checked'" : ""}>
                    <span class="js-script-hook-switch-slider"></span>
                </label>
            `;
        } else {
            // 创建标准复选框HTML
            html = `
                <label class="js-script-hook-checkbox-container">
                    <input id="${id}" class="js-script-hook-input" type="checkbox" ${isChecked ? "checked='checked'" : ""}>
                    <span class="js-script-hook-custom-checkbox"></span>
                </label>
            `;
        }
        
        const element = $(html);
        
        // 添加事件处理
        if (onChange) {
            element.find('input').on('change', function() {
                onChange($(this).is(':checked'));
            });
        }
        
        return element;
    }
} 