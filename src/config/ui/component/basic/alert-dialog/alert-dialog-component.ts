/**
 * 警告对话框组件 - 原生JavaScript实现
 */
import { LanguageEventManager } from '../../language-event';
import { Language } from '../../language';
import { createLogger } from '../../../../../logger';
import { alertDialogStyles } from './styles';

// 创建AlertDialog组件专用的日志记录器
const alertLogger = createLogger('alert-dialog-component');

/**
 * 自定义警告对话框组件
 */
export class AlertDialogComponent {
    private static instance: AlertDialogComponent;

    private constructor() {
        // 单例模式，私有构造函数
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

        try {
            const style = document.createElement('style');
            style.id = 'js-script-hook-alert-dialog-style';
            style.type = 'text/css';
            style.appendChild(document.createTextNode(alertDialogStyles));
            document.head.appendChild(style);
        } catch (error) {
            alertLogger.error(`添加样式失败: ${error}`);
        }
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
        okText?: string,
        callback?: () => void
    ): void {
        try {
            const language = LanguageEventManager.getInstance().getCurrentLanguage();
            const finalOkText = okText || language?.basic.okButton || 'OK';
            
            this.appendStyles();

            // 如果已经有对话框，先移除
            const existingOverlay = document.querySelector('.js-script-hook-alert-overlay');
            if (existingOverlay) {
                existingOverlay.remove();
            }

            // 创建对话框元素
            const overlay = document.createElement('div');
            overlay.className = 'js-script-hook-alert-overlay';

            const dialog = document.createElement('div');
            dialog.className = 'js-script-hook-alert-dialog';

            // 创建头部
            const header = document.createElement('div');
            header.className = 'js-script-hook-alert-header';

            const iconSpan = document.createElement('span');
            iconSpan.className = 'js-script-hook-alert-icon';
            iconSpan.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
            `;
            header.appendChild(iconSpan);
            header.appendChild(document.createTextNode(title));

            // 创建内容
            const body = document.createElement('div');
            body.className = 'js-script-hook-alert-body';
            body.textContent = message;

            // 创建底部按钮
            const footer = document.createElement('div');
            footer.className = 'js-script-hook-alert-footer';

            const okButton = document.createElement('button');
            okButton.className = 'js-script-hook-alert-btn';
            okButton.textContent = finalOkText;
            okButton.addEventListener('click', () => {
                this.close();
                if (callback) callback();
            });

            footer.appendChild(okButton);

            // 组装对话框
            dialog.appendChild(header);
            dialog.appendChild(body);
            dialog.appendChild(footer);
            overlay.appendChild(dialog);

            // 添加键盘事件监听
            const keyHandler = (event: KeyboardEvent) => {
                if (event.key === 'Enter' || event.key === 'Escape') {
                    this.close();
                    if (callback) callback();
                    document.removeEventListener('keydown', keyHandler);
                }
            };
            document.addEventListener('keydown', keyHandler);

            // 添加到页面
            document.body.appendChild(overlay);

            // 聚焦确认按钮
            okButton.focus();
        } catch (error) {
            alertLogger.error(`显示警告对话框失败: ${error}`);
            // 降级使用原生alert
            alert(message);
            if (callback) callback();
        }
    }

    /**
     * 关闭对话框
     */
    private close(): void {
        try {
            const overlay = document.querySelector('.js-script-hook-alert-overlay');
            if (overlay) {
                overlay.remove();
            }
        } catch (error) {
            alertLogger.error(`关闭对话框失败: ${error}`);
        }
    }
} 