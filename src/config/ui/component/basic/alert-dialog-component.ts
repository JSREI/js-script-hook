import $ from 'jquery';

/**
 * 自定义警告对话框组件
 */
export class AlertDialogComponent {
    private readonly styleCSS: string;
    private static instance: AlertDialogComponent;

    private constructor() {
        this.styleCSS = `
        .js-script-hook-alert-overlay {
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
        
        .js-script-hook-alert-dialog {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            width: 400px;
            max-width: 90%;
            overflow: hidden;
            animation: js-script-hook-alert-appear 0.2s ease-out;
        }
        
        @keyframes js-script-hook-alert-appear {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .js-script-hook-alert-header {
            background-color: #f5f5f5;
            padding: 15px 20px;
            font-weight: 500;
            font-size: 16px;
            color: #333;
            border-bottom: 1px solid #eee;
        }
        
        .js-script-hook-alert-body {
            padding: 20px;
            color: #555;
            font-size: 14px;
            line-height: 1.5;
        }
        
        .js-script-hook-alert-footer {
            display: flex;
            justify-content: center;
            padding: 15px 20px;
            background-color: #fafafa;
            border-top: 1px solid #eee;
        }
        
        .js-script-hook-alert-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
            background-color: #2196F3;
            color: white;
        }
        
        .js-script-hook-alert-btn:hover {
            background-color: #1e88e5;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .js-script-hook-alert-icon {
            display: inline-block;
            margin-right: 10px;
            color: #2196F3;
        }
        `;
    }

    /**
     * 获取单例实例
     */
    public static getInstance(): AlertDialogComponent {
        if (!AlertDialogComponent.instance) {
            AlertDialogComponent.instance = new AlertDialogComponent();
        }
        return AlertDialogComponent.instance;
    }

    /**
     * 添加组件样式到页面
     */
    private appendStyles(): void {
        if (document.getElementById('js-script-hook-alert-dialog-style')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'js-script-hook-alert-dialog-style';
        style.type = 'text/css';
        style.appendChild(document.createTextNode(this.styleCSS));
        document.head.appendChild(style);
    }

    /**
     * 显示警告对话框
     * 
     * @param title 对话框标题
     * @param message 提示消息
     * @param okText 确认按钮文本
     * @param callback 点击确认后的回调函数（可选）
     */
    public show(
        title: string, 
        message: string, 
        okText: string = '确定',
        callback?: () => void
    ): void {
        this.appendStyles();

        // 如果已经有对话框，先移除
        $('.js-script-hook-alert-overlay').remove();

        const dialogHTML = `
        <div class="js-script-hook-alert-overlay">
            <div class="js-script-hook-alert-dialog">
                <div class="js-script-hook-alert-header">
                    <span class="js-script-hook-alert-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    </span>
                    ${title}
                </div>
                <div class="js-script-hook-alert-body">
                    ${message}
                </div>
                <div class="js-script-hook-alert-footer">
                    <button class="js-script-hook-alert-btn">${okText}</button>
                </div>
            </div>
        </div>
        `;

        const $dialog = $(dialogHTML);
        $(document.body).append($dialog);

        // 绑定事件
        $dialog.find('.js-script-hook-alert-btn').on('click', () => {
            this.close();
            if (callback) callback();
        });
        
        // 回车确认
        $(document).on('keydown.alert-dialog', (event) => {
            if (event.key === 'Enter') {
                this.close();
                if (callback) callback();
            }
        });

        // ESC键关闭对话框
        $(document).on('keydown.alert-dialog', (event) => {
            if (event.key === 'Escape') {
                this.close();
                if (callback) callback();
            }
        });
    }

    /**
     * 关闭对话框
     */
    private close(): void {
        $('.js-script-hook-alert-overlay').remove();
        $(document).off('keydown.alert-dialog');
    }
} 