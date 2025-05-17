import $ from 'jquery';

type InputDialogCallback = (confirmed: boolean, value: string) => void;

/**
 * 自定义输入对话框组件
 */
export class InputDialogComponent {
    private readonly styleCSS: string;
    private static instance: InputDialogComponent;

    private constructor() {
        this.styleCSS = `
        .js-script-hook-input-dialog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 2147483647;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .js-script-hook-input-dialog {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            width: 400px;
            max-width: 90%;
            overflow: hidden;
            animation: js-script-hook-input-dialog-appear 0.2s ease-out;
        }
        
        @keyframes js-script-hook-input-dialog-appear {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .js-script-hook-input-dialog-header {
            background-color: #f5f5f5;
            padding: 15px 20px;
            font-weight: 500;
            font-size: 16px;
            color: #333;
            border-bottom: 1px solid #eee;
        }
        
        .js-script-hook-input-dialog-body {
            padding: 20px;
            color: #555;
            font-size: 14px;
            line-height: 1.5;
        }
        
        .js-script-hook-input-dialog-input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            margin-top: 10px;
            font-size: 14px;
            box-sizing: border-box;
        }
        
        .js-script-hook-input-dialog-input:focus {
            border-color: #2196F3;
            outline: none;
            box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
        }
        
        .js-script-hook-input-dialog-footer {
            display: flex;
            justify-content: flex-end;
            padding: 15px 20px;
            background-color: #fafafa;
            border-top: 1px solid #eee;
        }
        
        .js-script-hook-input-dialog-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
            margin-left: 10px;
        }
        
        .js-script-hook-input-dialog-cancel-btn {
            background-color: #f5f5f5;
            color: #666;
        }
        
        .js-script-hook-input-dialog-cancel-btn:hover {
            background-color: #eee;
        }
        
        .js-script-hook-input-dialog-ok-btn {
            background-color: #2196F3;
            color: white;
        }
        
        .js-script-hook-input-dialog-ok-btn:hover {
            background-color: #1e88e5;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .js-script-hook-input-dialog-icon {
            display: inline-block;
            margin-right: 10px;
            color: #2196F3;
        }
        `;
    }

    /**
     * 获取单例实例
     */
    public static getInstance(): InputDialogComponent {
        if (!InputDialogComponent.instance) {
            InputDialogComponent.instance = new InputDialogComponent();
        }
        return InputDialogComponent.instance;
    }

    /**
     * 添加组件样式到页面
     */
    private appendStyles(): void {
        if (document.getElementById('js-script-hook-input-dialog-style')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'js-script-hook-input-dialog-style';
        style.type = 'text/css';
        style.appendChild(document.createTextNode(this.styleCSS));
        document.head.appendChild(style);
    }

    /**
     * 显示输入对话框
     * 
     * @param title 对话框标题
     * @param message 提示消息
     * @param callback 回调函数，传递确认状态和输入值
     * @param defaultValue 默认输入值
     * @param placeholder 输入框占位符
     * @param okText 确认按钮文本
     * @param cancelText 取消按钮文本
     */
    public show(
        title: string, 
        message: string, 
        callback: InputDialogCallback,
        defaultValue: string = '',
        placeholder: string = '',
        okText: string = '确定', 
        cancelText: string = '取消'
    ): void {
        this.appendStyles();

        // 如果已经有对话框，先移除
        $('.js-script-hook-input-dialog-overlay').remove();

        const dialogHTML = `
        <div class="js-script-hook-input-dialog-overlay">
            <div class="js-script-hook-input-dialog">
                <div class="js-script-hook-input-dialog-header">
                    <span class="js-script-hook-input-dialog-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    </span>
                    ${title}
                </div>
                <div class="js-script-hook-input-dialog-body">
                    ${message}
                    <input class="js-script-hook-input-dialog-input" type="text" value="${defaultValue}" placeholder="${placeholder}">
                </div>
                <div class="js-script-hook-input-dialog-footer">
                    <button class="js-script-hook-input-dialog-btn js-script-hook-input-dialog-cancel-btn">${cancelText}</button>
                    <button class="js-script-hook-input-dialog-btn js-script-hook-input-dialog-ok-btn">${okText}</button>
                </div>
            </div>
        </div>
        `;

        const $dialog = $(dialogHTML);
        $(document.body).append($dialog);
        
        // 自动聚焦到输入框
        setTimeout(() => {
            $dialog.find('.js-script-hook-input-dialog-input').focus();
        }, 100);

        // 获取输入值的函数
        const getInputValue = (): string => {
            return $dialog.find('.js-script-hook-input-dialog-input').val() as string;
        };

        // 绑定事件
        $dialog.find('.js-script-hook-input-dialog-cancel-btn').on('click', () => {
            this.close();
            callback(false, getInputValue());
        });

        $dialog.find('.js-script-hook-input-dialog-ok-btn').on('click', () => {
            this.close();
            callback(true, getInputValue());
        });
        
        // 输入框回车确认
        $dialog.find('.js-script-hook-input-dialog-input').on('keydown', (event) => {
            if (event.key === 'Enter') {
                this.close();
                callback(true, getInputValue());
            }
        });

        // 点击空白处关闭对话框
        $dialog.on('click', (event) => {
            if ($(event.target).hasClass('js-script-hook-input-dialog-overlay')) {
                this.close();
                callback(false, getInputValue());
            }
        });

        // ESC键关闭对话框
        $(document).on('keydown.input-dialog', (event) => {
            if (event.key === 'Escape') {
                this.close();
                callback(false, getInputValue());
            }
        });
    }

    /**
     * 关闭对话框
     */
    private close(): void {
        $('.js-script-hook-input-dialog-overlay').remove();
        $(document).off('keydown.input-dialog');
    }
} 