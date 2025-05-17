import { Language } from '../../language';
import { LanguageUpdateable, LanguageEventManager } from '../../language-event';
import { createLogger } from '../../../../../logger';
import { inputDialogStyles } from './styles';

const logger = createLogger('InputDialogComponent');

/**
 * 输入对话框回调函数类型
 */
type InputDialogCallback = (confirmed: boolean, value: string) => void;

/**
 * 对话框配置接口
 */
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
 * 输入对话框组件 - 实现单例模式
 */
export class InputDialogComponent implements LanguageUpdateable {
    private static instance: InputDialogComponent;
    private readonly componentId: string;
    private currentConfig: DialogConfig | null = null;
    private dialogElement: HTMLElement | null = null;
    private static stylesAppended = false;

    /**
     * 私有构造函数，确保单例模式
     */
    private constructor() {
        this.componentId = 'input-dialog-component-' + Math.random().toString(36).substring(2, 10);
        
        // 订阅语言更新事件
        LanguageEventManager.getInstance().subscribe(this.componentId, (language: Language) => {
            this.updateLanguage(language);
        });
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
        if (InputDialogComponent.stylesAppended) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'js-script-hook-input-dialog-style';
        style.innerHTML = inputDialogStyles;
        document.head.appendChild(style);
        InputDialogComponent.stylesAppended = true;
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
        okText?: string, 
        cancelText?: string
    ): void {
        try {
            // 获取当前语言配置
            const language = LanguageEventManager.getInstance().getCurrentLanguage();
            
            // 检测是否为URL测试对话框并应用正确的语言
            const isUrlTestDialog = title.includes('enter the URL') || 
                                   title.includes('Please enter the URL') || 
                                   title.includes('请输入要测试的URL');
            
            if (isUrlTestDialog && language) {
                // 使用当前语言的URL测试提示
                title = language.debugger_config.urlPatternTestPrompt;
                placeholder = language.debugger_config.urlPatternTextPlaceholder;
                okText = language.basic.testButton;
                cancelText = language.basic.inputDialog.defaultCancelText;
                logger.debug(`检测到URL测试对话框，应用当前语言的文本配置`);
            }
            
            // 保存当前配置
            this.currentConfig = {
                title,
                message,
                callback,
                defaultValue,
                placeholder,
                okText: okText || (language?.basic.inputDialog.defaultOkText || 'OK'),
                cancelText: cancelText || (language?.basic.inputDialog.defaultCancelText || 'Cancel')
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
            cancelButton.textContent = this.currentConfig.cancelText;
            cancelButton.onclick = () => {
                callback(false, '');
                this.close();
            };

            const okButton = document.createElement('button');
            okButton.className = 'js-script-hook-input-dialog-btn js-script-hook-input-dialog-ok-btn';
            okButton.textContent = this.currentConfig.okText;
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
        } catch (error) {
            logger.error(`显示输入对话框时出错: ${error}`);
            if (callback) {
                callback(false, '');
            }
        }
    }

    /**
     * 关闭对话框
     */
    private close(): void {
        try {
            const overlay = document.querySelector('.js-script-hook-input-dialog-overlay');
            if (overlay) {
                overlay.remove();
            }
            this.dialogElement = null;
        } catch (error) {
            logger.error(`关闭输入对话框时出错: ${error}`);
        }
    }

    /**
     * 获取组件ID
     */
    public getComponentId(): string {
        return this.componentId;
    }

    /**
     * 更新组件的语言
     * @param language 新的语言配置
     */
    public updateLanguage(language: Language): void {
        try {
            if (!this.dialogElement || !this.currentConfig) {
                return;
            }
            
            // 更新对话框标题
            const header = this.dialogElement.querySelector('.js-script-hook-input-dialog-header');
            if (header) {
                // 保存图标元素
                const iconSpan = header.querySelector('.js-script-hook-input-dialog-icon');
                const iconHtml = iconSpan ? iconSpan.outerHTML : '';
                
                // 检查标题是否需要本地化
                if (this.currentConfig.title.includes('enter the URL') || 
                    this.currentConfig.title.includes('Please enter the URL') ||
                    this.currentConfig.title.includes('请输入要测试的URL')) {
                    // 检测到是URL测试对话框，使用对应语言的提示文本
                    header.innerHTML = iconHtml + language.debugger_config.urlPatternTestPrompt;
                    logger.debug(`已将对话框标题更新为URL测试提示: ${language.debugger_config.urlPatternTestPrompt}`);
                }
            }
            
            // 更新确认按钮文本
            const okButton = this.dialogElement.querySelector('.js-script-hook-input-dialog-ok-btn') as HTMLButtonElement;
            if (okButton) {
                // 检查是否为测试按钮
                if (this.currentConfig.okText === 'Test' || 
                    this.currentConfig.okText === '测试' ||
                    this.currentConfig.okText === language.basic.testButton) {
                    okButton.textContent = language.basic.testButton;
                    logger.debug(`已将确认按钮更新为测试按钮: ${language.basic.testButton}`);
                } else {
                    okButton.textContent = language.basic.inputDialog.defaultOkText;
                }
            }
            
            // 更新取消按钮文本
            const cancelButton = this.dialogElement.querySelector('.js-script-hook-input-dialog-cancel-btn') as HTMLButtonElement;
            if (cancelButton) {
                cancelButton.textContent = language.basic.inputDialog.defaultCancelText;
                logger.debug(`已将取消按钮更新为: ${language.basic.inputDialog.defaultCancelText}`);
            }
            
            // 更新输入框的placeholder
            const inputField = this.dialogElement.querySelector('.js-script-hook-input-dialog-input') as HTMLInputElement;
            if (inputField) {
                // 如果当前placeholder是URL pattern相关的提示文本
                if (this.currentConfig.placeholder === language.debugger_config.urlPatternTextPlaceholder ||
                    this.currentConfig.placeholder.includes('Enter a keyword') || 
                    this.currentConfig.placeholder.includes('输入关键字')) {
                    inputField.placeholder = language.debugger_config.urlPatternTextPlaceholder;
                    logger.debug(`已将输入框占位符更新为URL匹配提示: ${language.debugger_config.urlPatternTextPlaceholder}`);
                } 
                // 如果当前placeholder是JSONP回调函数参数名相关的提示文本
                else if (this.currentConfig.placeholder.includes('If not specified') || 
                        this.currentConfig.placeholder.includes('不指定的话')) {
                    inputField.placeholder = language.debugger_config.callbackFunctionParamNamePlaceholder;
                }
                // 如果是其他类型的placeholder，保持原样
                else if (this.currentConfig.placeholder) {
                    inputField.placeholder = this.currentConfig.placeholder;
                }
            }
        } catch (error) {
            logger.error(`更新输入对话框语言时出错: ${error}`);
        }
    }

    /**
     * 组件销毁时取消订阅
     */
    public destroy(): void {
        try {
            // 取消订阅语言更新
            LanguageEventManager.getInstance().unsubscribe(this.componentId);
            
            // 关闭对话框
            this.close();
        } catch (error) {
            logger.error(`销毁输入对话框组件时出错: ${error}`);
        }
    }
} 