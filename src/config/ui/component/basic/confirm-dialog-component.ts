import { jQuery as $ } from '../utils/jquery-adapter';

type ConfirmCallback = (confirmed: boolean) => void;

/**
 * 自定义确认对话框组件
 */
export class ConfirmDialogComponent {
    private readonly styleCSS: string;
    private static instance: ConfirmDialogComponent;

    private constructor() {
        this.styleCSS = `
        .js-script-hook-confirm-overlay {
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
        
        .js-script-hook-confirm-dialog {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            width: 400px;
            max-width: 90%;
            overflow: hidden;
            animation: js-script-hook-confirm-appear 0.2s ease-out;
        }
        
        @keyframes js-script-hook-confirm-appear {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .js-script-hook-confirm-header {
            background-color: #f5f5f5;
            padding: 15px 20px;
            font-weight: 500;
            font-size: 16px;
            color: #333;
            border-bottom: 1px solid #eee;
        }
        
        .js-script-hook-confirm-body {
            padding: 20px;
            color: #555;
            font-size: 14px;
            line-height: 1.5;
        }
        
        .js-script-hook-confirm-footer {
            display: flex;
            justify-content: flex-end;
            padding: 15px 20px;
            background-color: #fafafa;
            border-top: 1px solid #eee;
        }
        
        .js-script-hook-confirm-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
            margin-left: 10px;
        }
        
        .js-script-hook-confirm-cancel-btn {
            background-color: #f5f5f5;
            color: #666;
        }
        
        .js-script-hook-confirm-cancel-btn:hover {
            background-color: #eee;
        }
        
        .js-script-hook-confirm-ok-btn {
            background-color: #f44336;
            color: white;
        }
        
        .js-script-hook-confirm-ok-btn:hover {
            background-color: #e53935;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .js-script-hook-dialog-icon {
            display: inline-block;
            margin-right: 10px;
            color: #f44336;
        }
        `;
    }

    /**
     * 获取单例实例
     */
    public static getInstance(): ConfirmDialogComponent {
        if (!ConfirmDialogComponent.instance) {
            ConfirmDialogComponent.instance = new ConfirmDialogComponent();
        }
        return ConfirmDialogComponent.instance;
    }

    /**
     * 添加组件样式到页面
     */
    private appendStyles(): void {
        if (document.getElementById('js-script-hook-confirm-dialog-style')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'js-script-hook-confirm-dialog-style';
        style.type = 'text/css';
        style.appendChild(document.createTextNode(this.styleCSS));
        document.head.appendChild(style);
    }

    /**
     * 显示确认对话框
     * 
     * @param title 对话框标题
     * @param message 确认消息
     * @param callback 回调函数
     * @param okText 确认按钮文本
     * @param cancelText 取消按钮文本
     */
    public show(
        title: string, 
        message: string, 
        callback: ConfirmCallback, 
        okText: string = '确定', 
        cancelText: string = '取消'
    ): void {
        this.appendStyles();

        // 如果已经有对话框，先移除
        $('.js-script-hook-confirm-overlay').remove();

        const dialogHTML = `
        <div class="js-script-hook-confirm-overlay">
            <div class="js-script-hook-confirm-dialog">
                <div class="js-script-hook-confirm-header">
                    <span class="js-script-hook-dialog-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </span>
                    ${title}
                </div>
                <div class="js-script-hook-confirm-body">
                    ${message}
                </div>
                <div class="js-script-hook-confirm-footer">
                    <button class="js-script-hook-confirm-btn js-script-hook-confirm-cancel-btn">${cancelText}</button>
                    <button class="js-script-hook-confirm-btn js-script-hook-confirm-ok-btn">${okText}</button>
                </div>
            </div>
        </div>
        `;

        const $dialog = $(dialogHTML);
        $(document.body).append($dialog);

        // 绑定事件
        $dialog.find('.js-script-hook-confirm-cancel-btn').on('click', () => {
            this.close();
            callback(false);
        });

        $dialog.find('.js-script-hook-confirm-ok-btn').on('click', () => {
            this.close();
            callback(true);
        });

        // 点击空白处关闭对话框
        $dialog.on('click', (event) => {
            if ($(event.target).hasClass('js-script-hook-confirm-overlay')) {
                this.close();
                callback(false);
            }
        });

        // ESC键关闭对话框
        $(document).on('keydown.confirm-dialog', (event) => {
            if (event.key === 'Escape') {
                this.close();
                callback(false);
            }
        });
    }

    /**
     * 关闭对话框
     */
    private close(): void {
        $('.js-script-hook-confirm-overlay').remove();
        $(document).off('keydown.confirm-dialog');
    }
} 