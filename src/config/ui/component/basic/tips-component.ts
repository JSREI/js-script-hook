import $ from 'jquery';

export class TipsComponent {
    private readonly styleCSS: string;

    constructor() {
        this.styleCSS = `
        /* 问号提示图标样式 */
        .js-script-hook-tips-icon {
            display: inline-block;
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            border-radius: 50%;
            background-color: #eee;
            color: #666;
            cursor: help;
            margin-right: 5px;
            position: relative;
            font-weight: bold;
        }
        
        .js-script-hook-tips-icon:hover {
            background-color: #ddd;
        }
        
        /* 问号提示内容 */
        .js-script-hook-tooltip {
            display: none;
            position: absolute;
            z-index: 100;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            width: 300px;
            top: -5px;
            left: 25px;
            font-weight: normal;
            text-align: left;
            font-size: 12px;
        }
        
        .js-script-hook-tips-icon:hover .js-script-hook-tooltip {
            display: block;
        }
        `;
    }

    /**
     * 添加组件样式到页面
     */
    private appendStyles(): void {
        // 避免重复插入
        if (document.getElementById("tips-component-style")) {
            return;
        }

        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "tips-component-style";
        style.appendChild(document.createTextNode(this.styleCSS));
        document.head.appendChild(style);
    }

    /**
     * 渲染提示图标组件
     * @param tipText 提示文本
     * @returns jQuery对象
     */
    render(tipText: string): JQuery<HTMLElement> {
        // 确保样式已添加
        this.appendStyles();
        
        // 创建提示图标HTML
        const html = `
            <div class="js-script-hook-tips-icon">
                ?
                <div class="js-script-hook-tooltip">
                    ${tipText}
                </div>
            </div>
        `;
        
        return $(html);
    }
} 