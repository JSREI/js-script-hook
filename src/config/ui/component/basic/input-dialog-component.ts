/**
 * 输入对话框组件 - 原生JavaScript实现
 */
import { LanguageUpdateable } from '../language-updateable';
import { Language } from '../language';
import { LanguageEventManager } from '../language-event-manager';
import { createLogger } from '../../../../logger';

const inputDialogLogger = createLogger('input-dialog-component');

type InputDialogCallback = (confirmed: boolean, value: string) => void;

interface DialogConfig {
    title: string;
    message: string;
    callback: InputDialogCallback;
    defaultValue?: string;
    placeholder?: string;
    okText?: string;
    cancelText?: string;
}

/**
 * 自定义输入对话框组件
 */
export class InputDialogComponent implements LanguageUpdateable {
    private readonly styleCSS: string;
    private readonly componentId: string;
    private static instance: InputDialogComponent;
    private currentConfig: DialogConfig | null = null;
    private dialogElement: HTMLElement | null = null;

    private constructor() {
        this.componentId = 'input-dialog-component-' + Math.random().toString(36).substring(2, 10);
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
        
        this.appendStyles();
        
        // 订阅语言更新事件
        LanguageEventManager.getInstance().subscribe(this.componentId, this.updateLanguage.bind(this));
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
        // 保存当前配置
        this.currentConfig = {
            title,
            message,
            callback,
            defaultValue,
            placeholder,
            okText,
            cancelText
        };

        this.appendStyles();

        // 如果已经有对话框，先移除
        const existingOverlay = document.querySelector('.js-script-hook-input-dialog-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        // 创建对话框元素
        const overlay = document.createElement('div');
        overlay.className = 'js-script-hook-input-dialog-overlay';

        this.dialogElement = document.createElement('div');
        this.dialogElement.className = 'js-script-hook-input-dialog';

        // 创建头部
        const header = document.createElement('div');
        header.className = 'js-script-hook-input-dialog-header';

        const iconSpan = document.createElement('span');
        iconSpan.className = 'js-script-hook-input-dialog-icon';
        iconSpan.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
        `;

        header.appendChild(iconSpan);
        header.appendChild(document.createTextNode(title));
        this.dialogElement.appendChild(header);

        // 创建内容区域
        const body = document.createElement('div');
        body.className = 'js-script-hook-input-dialog-body';
        body.textContent = message;

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'js-script-hook-input-dialog-input';
        input.value = defaultValue;
        input.placeholder = placeholder;
        body.appendChild(input);
        this.dialogElement.appendChild(body);

        // 创建底部按钮区域
        const footer = document.createElement('div');
        footer.className = 'js-script-hook-input-dialog-footer';

        const cancelButton = document.createElement('button');
        cancelButton.className = 'js-script-hook-input-dialog-btn js-script-hook-input-dialog-cancel-btn';
        cancelButton.textContent = cancelText;
        cancelButton.onclick = () => {
            callback(false, '');
            this.close();
        };

        const okButton = document.createElement('button');
        okButton.className = 'js-script-hook-input-dialog-btn js-script-hook-input-dialog-ok-btn';
        okButton.textContent = okText;
        okButton.onclick = () => {
            callback(true, input.value);
            this.close();
        };

        footer.appendChild(cancelButton);
        footer.appendChild(okButton);
        this.dialogElement.appendChild(footer);

        // 添加键盘事件处理
        const keyHandler = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                callback(true, input.value);
                this.close();
            } else if (event.key === 'Escape') {
                event.preventDefault();
                callback(false, '');
                this.close();
            }
        };

        input.addEventListener('keydown', keyHandler);
        overlay.appendChild(this.dialogElement);
        document.body.appendChild(overlay);
        input.focus();
    }

    /**
     * 关闭对话框
     */
    private close(): void {
        const overlay = document.querySelector('.js-script-hook-input-dialog-overlay');
        if (overlay) {
            overlay.remove();
        }
        this.dialogElement = null;
    }

    /**
     * 实现LanguageUpdateable接口
     */
    public getComponentId(): string {
        return this.componentId;
    }

    /**
     * 更新组件的语言
     * @param language 新的语言配置
     */
    public updateLanguage(language: Language): void {
        if (!this.dialogElement || !this.currentConfig) {
            return;
        }

        try {
            // 更新对话框标题
            const header = this.dialogElement.querySelector('.js-script-hook-input-dialog-header');
            if (header) {
                const iconSpan = header.querySelector('.js-script-hook-input-dialog-icon');
                header.textContent = this.currentConfig.title;
                if (iconSpan) {
                    header.insertBefore(iconSpan, header.firstChild);
                }
            }

            // 更新对话框消息
            const body = this.dialogElement.querySelector('.js-script-hook-input-dialog-body');
            if (body) {
                const input = body.querySelector('.js-script-hook-input-dialog-input');
                body.textContent = this.currentConfig.message;
                if (input) {
                    body.appendChild(input);
                }
            }

            // 更新按钮文本
            const footer = this.dialogElement.querySelector('.js-script-hook-input-dialog-footer');
            if (footer) {
                const cancelButton = footer.querySelector('.js-script-hook-input-dialog-cancel-btn');
                const okButton = footer.querySelector('.js-script-hook-input-dialog-ok-btn');
                
                if (cancelButton) {
                    cancelButton.textContent = this.currentConfig.cancelText || '取消';
                }
                if (okButton) {
                    okButton.textContent = this.currentConfig.okText || '确定';
                }
            }
        } catch (error) {
            inputDialogLogger.error(`更新输入对话框语言时出错: ${error}`);
        }
    }

    /**
     * 组件销毁时取消订阅
     */
    public destroy(): void {
        LanguageEventManager.getInstance().unsubscribe(this.componentId);
    }
} 