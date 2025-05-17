/**
 * 关于页面组件 - 原生JavaScript实现
 */
import { type Language } from '../language';
import { LanguageUpdateable, LanguageEventManager } from '../language-event';
import { createLogger } from '../../../../logger';
import { aboutStyles } from './styles';

const aboutLogger = createLogger('about-component');

/**
 * 关于页面组件
 */
export class AboutComponent implements LanguageUpdateable {
    private readonly componentId: string;
    private repoStars: number = 0;
    private readonly repoOwner: string = 'JSREI';
    private readonly repoName: string = 'js-script-hook';
    private readonly cacheKey: string = 'js_script_hook_github_stars_cache';
    private readonly cacheExpiry: number = 3600000; // 1小时的毫秒数
    private containerElement: HTMLElement | null = null;
    private currentLanguage: Language | undefined;
    private static stylesAppended = false;

    constructor() {
        this.componentId = 'about-component-' + Math.random().toString(36).substring(2, 10);
        
        this.appendStyles();
        
        // 订阅语言更新事件
        LanguageEventManager.getInstance().subscribe(this.componentId, this.updateLanguage.bind(this));
    }

    /**
     * 添加样式到页面
     */
    private appendStyles(): void {
        if (AboutComponent.stylesAppended || document.getElementById('about-component-style')) {
            return;
        }

        try {
            const style = document.createElement('style');
            style.id = 'about-component-style';
            style.type = 'text/css';
            style.appendChild(document.createTextNode(aboutStyles));
            document.head.appendChild(style);
            AboutComponent.stylesAppended = true;
        } catch (error) {
            aboutLogger.error(`添加样式失败: ${error}`);
        }
    }
    
    /**
     * 获取GitHub仓库的star数量，带缓存机制
     */
    private async fetchRepoStars(): Promise<void> {
        try {
            // 尝试从缓存获取
            const cachedData = this.getStarsFromCache();
            if (cachedData) {
                // 如果有有效的缓存数据，直接使用
                this.repoStars = cachedData.stars;
                this.updateStarCountDisplay();
                return;
            }

            // 没有缓存或缓存已过期，从API获取
            const response = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}`);
            if (response.ok) {
                const data = await response.json();
                this.repoStars = data.stargazers_count || 0;
                
                // 更新显示和缓存
                this.updateStarCountDisplay();
                this.saveStarsToCache(this.repoStars);
            }
        } catch (error) {
            aboutLogger.error(`获取GitHub仓库star数量失败: ${error}`);
            
            // 出错时尝试使用缓存中的值（即使已过期）
            const cachedData = this.getStarsFromCache(true);
            if (cachedData) {
                this.repoStars = cachedData.stars;
                this.updateStarCountDisplay();
            }
        }
    }
    
    /**
     * 更新Star计数显示
     */
    private updateStarCountDisplay(): void {
        const starCounter = document.getElementById('github-star-count');
        if (starCounter) {
            starCounter.textContent = String(this.repoStars);
        }
    }
    
    /**
     * 从缓存中获取Star数据
     * @param ignoreExpiry 是否忽略过期时间（用于错误情况下）
     * @returns 缓存的数据或null
     */
    private getStarsFromCache(ignoreExpiry: boolean = false): { stars: number, timestamp: number } | null {
        try {
            const cachedJson = localStorage.getItem(this.cacheKey);
            if (!cachedJson) return null;
            
            const cached = JSON.parse(cachedJson);
            const now = Date.now();
            
            // 检查缓存是否有效（除非忽略过期时间）
            if (ignoreExpiry || (cached.timestamp && now - cached.timestamp < this.cacheExpiry)) {
                return cached;
            }
        } catch (e) {
            aboutLogger.error(`读取缓存失败: ${e}`);
        }
        return null;
    }
    
    /**
     * 保存Star数据到缓存
     * @param stars Star数量
     */
    private saveStarsToCache(stars: number): void {
        try {
            const data = {
                stars,
                timestamp: Date.now()
            };
            localStorage.setItem(this.cacheKey, JSON.stringify(data));
        } catch (e) {
            aboutLogger.error(`保存缓存失败: ${e}`);
        }
    }

    /**
     * 创建DOM元素的辅助函数
     */
    private createElement(tag: string, className?: string, textContent?: string): HTMLElement {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (textContent) element.textContent = textContent;
        return element;
    }

    /**
     * 渲染关于页面组件
     * @param language 语言配置
     * @returns HTMLElement
     */
    public render(language?: Language): HTMLElement {
        this.currentLanguage = language;
        
        // 创建容器
        this.containerElement = this.createElement('div', 'about-container');
        
        // 创建反馈部分
        const feedbackSection = this.createElement('div', 'about-section');
        const feedbackTitle = this.createElement('div', 'about-title');
        feedbackTitle.textContent = language?.about.feedback.title || 'Feedback';
        feedbackSection.appendChild(feedbackTitle);
        
        const feedbackContent = this.createElement('div', 'about-content');
        feedbackContent.textContent = language?.about.feedback.content || 'If you have any questions or suggestions, please feel free to contact us.';
        feedbackSection.appendChild(feedbackContent);
        
        // 添加提交Issue按钮 - 独立一行
        const submitIssueBtn = document.createElement('a');
        submitIssueBtn.href = `https://github.com/${this.repoOwner}/${this.repoName}/issues/new`;
        submitIssueBtn.target = '_blank';
        submitIssueBtn.className = 'feedback-button';
        submitIssueBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path fill-rule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"></path>
            </svg>
            ${language?.about.feedback.submitIssue || 'Submit Issue'}
        `;
        feedbackSection.appendChild(submitIssueBtn);
        
        // 创建项目信息部分
        const projectSection = this.createElement('div', 'about-section');
        const projectTitle = this.createElement('div', 'about-title');
        projectTitle.textContent = language?.about.project.title || 'Project Information';
        projectSection.appendChild(projectTitle);
        
        const projectContent = this.createElement('div', 'about-content');
        projectContent.innerHTML = `
            <div class="about-repo-info">
                <a href="https://github.com/${this.repoOwner}/${this.repoName}" target="_blank" class="github-badge">
                    <span class="github-badge-left">
                        <svg height="16" viewBox="0 0 16 16" width="16" style="margin-right: 4px;">
                            <path fill="white" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                        </svg>
                        GitHub
                    </span>
                    <span class="github-badge-right">
                        <span class="star-count" id="github-star-count">${this.repoStars}</span>
                        <span class="star-me-text">${language?.about.project.starMe || 'Star Me'}</span>
                    </span>
                </a>
            </div>
        `;
        projectSection.appendChild(projectContent);
        
        // 创建群组信息部分
        const groupSection = this.createElement('div', 'about-section');
        const groupTitle = this.createElement('div', 'about-title');
        groupTitle.textContent = language?.about.group.title || 'Join Our Community';
        groupSection.appendChild(groupTitle);
        
        const groupContent = this.createElement('div', 'about-content');
        groupContent.textContent = language?.about.group.content || 'Scan the QR code below to join our community:';
        groupSection.appendChild(groupContent);
        
        const qrcodeContainer = this.createElement('div', 'qrcode-flex-container');
        
        // 添加微信群二维码
        const wechatGroup = this.createElement('div', 'qrcode-item');
        const wechatTitle = this.createElement('div', 'qrcode-item-title');
        wechatTitle.textContent = language?.about.group.wechatGroup || 'WeChat Group';
        const wechatQrcode = document.createElement('img');
        wechatQrcode.src = 'https://cdn.jsdelivr.net/gh/JSREI/.github/profile/README.assets/image-20241016230653669.png';
        wechatQrcode.alt = 'WeChat Group QR Code';
        wechatQrcode.className = 'about-qrcode';
        wechatGroup.appendChild(wechatTitle);
        wechatGroup.appendChild(wechatQrcode);
        qrcodeContainer.appendChild(wechatGroup);
        
        // 添加个人微信二维码
        const personalWechat = this.createElement('div', 'qrcode-item');
        const personalWechatTitle = this.createElement('div', 'qrcode-item-title');
        personalWechatTitle.textContent = language?.about.group.personalWechat || 'Personal WeChat';
        personalWechatTitle.style.height = 'auto';  // 允许更多文本高度
        personalWechatTitle.style.marginBottom = '10px';  // 增加间距
        const personalWechatQrcode = document.createElement('img');
        personalWechatQrcode.src = 'https://cdn.jsdelivr.net/gh/JSREI/.github/profile/README.assets/image-20231030132026541-7614065.png';
        personalWechatQrcode.alt = 'Personal WeChat QR Code';
        personalWechatQrcode.className = 'about-qrcode';
        personalWechat.appendChild(personalWechatTitle);
        personalWechat.appendChild(personalWechatQrcode);
        qrcodeContainer.appendChild(personalWechat);
        
        // 添加Telegram群二维码
        const telegramGroup = this.createElement('div', 'qrcode-item');
        const telegramTitle = this.createElement('div', 'qrcode-item-title');
        telegramTitle.textContent = language?.about.group.telegramGroup || 'Telegram Group';
        const telegramQrcode = document.createElement('img');
        telegramQrcode.src = 'https://cdn.jsdelivr.net/gh/JSREI/.github/profile/README.assets/image-20241016231143315.png';
        telegramQrcode.alt = 'Telegram Group QR Code';
        telegramQrcode.className = 'about-qrcode';
        const telegramLink = document.createElement('a');
        telegramLink.href = 'https://t.me/jsreijsrei';
        telegramLink.target = '_blank';
        telegramLink.textContent = language?.about.group.telegramLink || 'Click to join Telegram group';
        telegramLink.className = 'about-link';
        telegramGroup.appendChild(telegramTitle);
        telegramGroup.appendChild(telegramQrcode);
        telegramGroup.appendChild(telegramLink);
        qrcodeContainer.appendChild(telegramGroup);
        
        groupSection.appendChild(qrcodeContainer);
        
        // 添加组织信息部分
        const orgSection = this.createElement('div', 'about-section');
        const orgTitle = this.createElement('div', 'about-title');
        orgTitle.textContent = language?.about.organization.title || 'Organization';
        orgSection.appendChild(orgTitle);
        
        const orgContent = this.createElement('div', 'about-content');
        orgContent.innerHTML = `
            ${language?.about.organization.content || 'We are JSREI, focusing on JavaScript runtime security research.'}
            <a href="https://github.com/${this.repoOwner}" target="_blank" class="about-link">@${this.repoOwner}</a>
        `;
        orgSection.appendChild(orgContent);
        
        // 将所有部分添加到容器
        this.containerElement.appendChild(feedbackSection);
        this.containerElement.appendChild(projectSection);
        this.containerElement.appendChild(groupSection);
        this.containerElement.appendChild(orgSection);
        
        // 获取仓库星标数
        this.fetchRepoStars().then(() => this.updateStarCountDisplay());
        
        return this.containerElement;
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
        if (!this.containerElement || !language) {
            return;
        }

        try {
            this.currentLanguage = language;
            
            // 更新反馈部分
            const feedbackTitle = this.containerElement.querySelector('.about-section:nth-child(1) .about-title');
            const feedbackContent = this.containerElement.querySelector('.about-section:nth-child(1) .about-content');
            const submitIssueBtn = this.containerElement.querySelector('.about-section:nth-child(1) .feedback-button');
            if (feedbackTitle) feedbackTitle.textContent = language.about.feedback.title;
            if (feedbackContent) {
                // 直接更新文本内容
                feedbackContent.textContent = language.about.feedback.content;
            }
            if (submitIssueBtn) {
                const svgContent = submitIssueBtn.querySelector('svg')?.outerHTML || '';
                submitIssueBtn.innerHTML = svgContent + ' ' + language.about.feedback.submitIssue;
            }
            
            // 更新项目信息部分
            const projectTitle = this.containerElement.querySelector('.about-section:nth-child(2) .about-title');
            const starMeText = this.containerElement.querySelector('.star-me-text');
            if (projectTitle) projectTitle.textContent = language.about.project.title;
            if (starMeText) starMeText.textContent = language.about.project.starMe;
            
            // 更新群组信息部分
            const groupTitle = this.containerElement.querySelector('.about-section:nth-child(3) .about-title');
            const groupContent = this.containerElement.querySelector('.about-section:nth-child(3) .about-content');
            const wechatTitle = this.containerElement.querySelector('.qrcode-item:nth-child(1) .qrcode-item-title');
            const personalWechatTitle = this.containerElement.querySelector('.qrcode-item:nth-child(2) .qrcode-item-title');
            const telegramTitle = this.containerElement.querySelector('.qrcode-item:nth-child(3) .qrcode-item-title');
            const telegramLink = this.containerElement.querySelector('.qrcode-item:nth-child(3) .about-link');
            
            if (groupTitle) groupTitle.textContent = language.about.group.title;
            if (groupContent) groupContent.textContent = language.about.group.content;
            if (wechatTitle) wechatTitle.textContent = language.about.group.wechatGroup;
            if (personalWechatTitle) {
                personalWechatTitle.textContent = language.about.group.personalWechat;
                // 确保有足够高度显示多行文本
                (personalWechatTitle as HTMLElement).style.height = 'auto';
                (personalWechatTitle as HTMLElement).style.marginBottom = '10px';
            }
            if (telegramTitle) telegramTitle.textContent = language.about.group.telegramGroup;
            if (telegramLink) telegramLink.textContent = language.about.group.telegramLink;
            
            // 更新组织信息部分
            const orgTitle = this.containerElement.querySelector('.about-section:nth-child(4) .about-title');
            const orgContent = this.containerElement.querySelector('.about-section:nth-child(4) .about-content');
            if (orgTitle) orgTitle.textContent = language.about.organization.title;
            if (orgContent) {
                orgContent.innerHTML = `
                    ${language.about.organization.content}
                    <a href="https://github.com/${this.repoOwner}" target="_blank" class="about-link">@${this.repoOwner}</a>
                `;
            }
        } catch (error) {
            aboutLogger.error(`更新关于页面语言时出错: ${error}`);
        }
    }

    /**
     * 组件销毁时取消订阅
     */
    public destroy(): void {
        LanguageEventManager.getInstance().unsubscribe(this.componentId);
    }
} 