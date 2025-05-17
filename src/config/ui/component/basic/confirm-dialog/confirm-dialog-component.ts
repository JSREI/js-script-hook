import { Language } from '../../language';
import { LanguageUpdateable, LanguageEventManager } from '../../language-event';
import { createLogger } from '../../../../../logger';
import { confirmDialogStyles } from './styles';

const logger = createLogger('ConfirmDialogComponent');

/**
 * 确认对话框的回调函数类型
 */
type ConfirmCallback = (confirmed: boolean) => void;

/**
 * 确认对话框组件 - 实现单例模式
 */
export class ConfirmDialogComponent implements LanguageUpdateable {
    private static instance: ConfirmDialogComponent;
    private readonly componentId: string;
    private currentLanguage: Language | null;
    private static stylesAppended = false;
    
    // 存储当前对话框信息，用于语言切换时更新
    private currentDialogInfo: {
        title: string;
        message: string;
        callback: ConfirmCallback;
        okText?: string;
        cancelText?: string;
        isVisible: boolean;
    } | null = null;

    /**
     * 私有构造函数，确保单例模式
     */
    private constructor() {
        this.componentId = 'confirm-dialog-component';
        this.currentLanguage = null;
        
        // 订阅语言更新事件
        LanguageEventManager.getInstance().subscribe(this.componentId, (language: Language) => {
            this.updateLanguage(language);
        });
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
        if (ConfirmDialogComponent.stylesAppended) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'js-script-hook-confirm-dialog-style';
        style.innerHTML = confirmDialogStyles;
        document.head.appendChild(style);
        ConfirmDialogComponent.stylesAppended = true;
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
        okText?: string, 
        cancelText?: string
    ): void {
        try {
            // 保存当前对话框信息，用于语言切换时更新
            this.currentDialogInfo = {
                title,
                message,
                callback,
                okText,
                cancelText,
                isVisible: true
            };
            
            this.createAndShowDialog(title, message, callback, okText, cancelText);
        } catch (error) {
            logger.error(`显示确认对话框时出错: ${error}`);
        }
    }
    
    /**
     * 创建并显示对话框
     */
    private createAndShowDialog(
        title: string, 
        message: string, 
        callback: ConfirmCallback, 
        okText?: string, 
        cancelText?: string
    ): void {
        try {
            const language = LanguageEventManager.getInstance().getCurrentLanguage();
            this.currentLanguage = language;
            
            const finalOkText = okText || language?.basic.confirmDialog.defaultOkText || 'OK';
            const finalCancelText = cancelText || language?.basic.confirmDialog.defaultCancelText || 'Cancel';
            
            this.appendStyles();

            // 如果已经有对话框，先移除
            const existingOverlay = document.querySelector('.js-script-hook-confirm-overlay');
            if (existingOverlay) {
                existingOverlay.remove();
            }

            // 创建对话框元素
            const overlay = document.createElement('div');
            overlay.className = 'js-script-hook-confirm-overlay';
            overlay.id = 'js-script-hook-confirm-overlay';

            const dialog = document.createElement('div');
            dialog.className = 'js-script-hook-confirm-dialog';

            // 创建头部
            const header = document.createElement('div');
            header.className = 'js-script-hook-confirm-header';
            header.id = 'js-script-hook-confirm-header';

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
            body.id = 'js-script-hook-confirm-body';
            body.textContent = message;

            // 创建底部按钮
            const footer = document.createElement('div');
            footer.className = 'js-script-hook-confirm-footer';

            const cancelButton = document.createElement('button');
            cancelButton.className = 'js-script-hook-confirm-btn js-script-hook-confirm-cancel-btn';
            cancelButton.id = 'js-script-hook-confirm-cancel-btn';
            cancelButton.textContent = finalCancelText;
            cancelButton.addEventListener('click', () => {
                this.close();
                callback(false);
            });

            const okButton = document.createElement('button');
            okButton.className = 'js-script-hook-confirm-btn js-script-hook-confirm-ok-btn';
            okButton.id = 'js-script-hook-confirm-ok-btn';
            okButton.textContent = finalOkText;
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
        } catch (error) {
            logger.error(`创建对话框时出错: ${error}`);
            if (callback) {
                callback(false);
            }
        }
    }

    /**
     * 关闭对话框
     */
    private close(): void {
        try {
            if (this.currentDialogInfo) {
                this.currentDialogInfo.isVisible = false;
            }
            
            const overlay = document.querySelector('.js-script-hook-confirm-overlay');
            if (overlay) {
                overlay.remove();
            }
        } catch (error) {
            logger.error(`关闭对话框时出错: ${error}`);
        }
    }
    
    /**
     * 获取组件ID
     */
    public getComponentId(): string {
        return this.componentId;
    }
    
    /**
     * 更新组件语言
     * @param language 新的语言配置
     */
    public updateLanguage(language: Language): void {
        try {
            // 保存当前语言
            this.currentLanguage = language;
            
            if (!this.currentDialogInfo || !this.currentDialogInfo.isVisible) {
                return;
            }
            
            // 检查对话框是否已经显示
            const overlay = document.getElementById('js-script-hook-confirm-overlay');
            if (!overlay) {
                return;
            }
            
            // 直接更新对话框上的文本，而不是重新创建对话框
            // 这样可以避免对话框闪烁并保持用户交互状态
            
            // 更新标题
            const header = document.getElementById('js-script-hook-confirm-header');
            if (header) {
                // 保留图标
                const icon = header.querySelector('.js-script-hook-dialog-icon');
                if (icon) {
                    // 清除标题文本
                    header.textContent = '';
                    // 重新添加图标
                    header.appendChild(icon);
                    // 添加新的标题文本
                    header.appendChild(document.createTextNode(this.currentDialogInfo.title));
                }
            }
            
            // 更新消息
            const body = document.getElementById('js-script-hook-confirm-body');
            if (body) {
                body.textContent = this.currentDialogInfo.message;
            }
            
            // 更新取消按钮
            const cancelButton = document.getElementById('js-script-hook-confirm-cancel-btn');
            if (cancelButton) {
                cancelButton.textContent = this.currentDialogInfo.cancelText || language.basic.confirmDialog.defaultCancelText || 'Cancel';
            }
            
            // 更新确定按钮
            const okButton = document.getElementById('js-script-hook-confirm-ok-btn');
            if (okButton) {
                okButton.textContent = this.currentDialogInfo.okText || language.basic.confirmDialog.defaultOkText || 'OK';
            }
            
            // 特殊处理删除断点的确认对话框
            // 通过消息内容识别对话框类型
            if (this.currentDialogInfo.message.includes('delete this breakpoint') || 
                this.currentDialogInfo.message.includes('删除此断点')) {
                
                // 更新标题
                if (header) {
                    const icon = header.querySelector('.js-script-hook-dialog-icon');
                    if (icon) {
                        header.textContent = '';
                        header.appendChild(icon);
                        header.appendChild(document.createTextNode(language.confirm_dialog.deleteBreakpoint));
                    }
                }
                
                // 更新消息
                if (body) {
                    body.textContent = language.confirm_dialog.deleteConfirmMessage;
                }
                
                // 更新按钮
                if (cancelButton) {
                    cancelButton.textContent = language.confirm_dialog.cancelButton;
                }
                
                if (okButton) {
                    okButton.textContent = language.confirm_dialog.okButton;
                }
            }
        } catch (error) {
            logger.error(`更新对话框语言时出错: ${error}`);
        }
    }
    
    /**
     * 销毁组件
     */
    public destroy(): void {
        try {
            // 取消订阅语言更新
            LanguageEventManager.getInstance().unsubscribe(this.componentId);
            
            // 关闭对话框
            this.close();
            
            // 清理当前对话框信息
            this.currentDialogInfo = null;
        } catch (error) {
            logger.error(`销毁确认对话框组件时出错: ${error}`);
        }
    }
} 