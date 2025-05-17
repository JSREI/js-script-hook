/**
 * 确认对话框组件 - 原生JavaScript实现
 */

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
        const existingOverlay = document.querySelector('.js-script-hook-confirm-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        // 创建对话框元素
        const overlay = document.createElement('div');
        overlay.className = 'js-script-hook-confirm-overlay';

        const dialog = document.createElement('div');
        dialog.className = 'js-script-hook-confirm-dialog';

        // 创建头部
        const header = document.createElement('div');
        header.className = 'js-script-hook-confirm-header';

        const iconSpan = document.createElement('span');
        iconSpan.className = 'js-script-hook-dialog-icon';
        iconSpan.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
        `;
        header.appendChild(iconSpan);
        header.appendChild(document.createTextNode(title));

        // 创建内容
        const body = document.createElement('div');
        body.className = 'js-script-hook-confirm-body';
        body.textContent = message;

        // 创建底部按钮
        const footer = document.createElement('div');
        footer.className = 'js-script-hook-confirm-footer';

        const cancelButton = document.createElement('button');
        cancelButton.className = 'js-script-hook-confirm-btn js-script-hook-confirm-cancel-btn';
        cancelButton.textContent = cancelText;
        cancelButton.addEventListener('click', () => {
            this.close();
            callback(false);
        });

        const okButton = document.createElement('button');
        okButton.className = 'js-script-hook-confirm-btn js-script-hook-confirm-ok-btn';
        okButton.textContent = okText;
        okButton.addEventListener('click', () => {
            this.close();
            callback(true);
        });

        footer.appendChild(cancelButton);
        footer.appendChild(okButton);

        // 组装对话框
        dialog.appendChild(header);
        dialog.appendChild(body);
        dialog.appendChild(footer);
        overlay.appendChild(dialog);

        // 点击空白处关闭对话框
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                this.close();
                callback(false);
            }
        });

        // 添加到页面
        document.body.appendChild(overlay);
    }

    /**
     * 关闭对话框
     */
    private close(): void {
        const overlay = document.querySelector('.js-script-hook-confirm-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
} 