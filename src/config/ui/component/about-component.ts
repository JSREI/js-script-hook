/**
 * 关于页面组件 - 原生JavaScript实现
 */
import { type Language } from './language';
import { LanguageUpdateable } from './language-updateable';
import { LanguageEventManager } from './language-event-manager';
import { createLogger } from '../../../logger';

const aboutLogger = createLogger('about-component');

/**
 * 关于页面组件
 */
export class AboutComponent implements LanguageUpdateable {
    private readonly styleCSS: string;
    private readonly componentId: string;
    private repoStars: number = 0;
    private readonly repoOwner: string = 'JSREI';
    private readonly repoName: string = 'js-script-hook';
    private readonly cacheKey: string = 'js_script_hook_github_stars_cache';
    private readonly cacheExpiry: number = 3600000; // 1小时的毫秒数
    private containerElement: HTMLElement | null = null;
    private currentLanguage: Language | undefined;

    constructor() {
        this.componentId = 'about-component-' + Math.random().toString(36).substring(2, 10);
        this.styleCSS = `
        .about-container {
            width: 100%;
            padding: 20px;
            box-sizing: border-box;
        }
        
        .about-section {
            margin-bottom: 30px;
        }
        
        .about-title {
            font-size: 20px;
            font-weight: 600;
            color: #333;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 1px solid #eee;
        }
        
        .about-content {
            font-size: 14px;
            line-height: 1.6;
            color: #555;
        }
        
        .about-qrcode {
            width: 200px;
            margin: 10px;
            border: 1px solid #eee;
            border-radius: 5px;
        }
        
        .about-qrcode-container {
            margin: 10px 0;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
        }
        
        .about-qrcode-title {
            font-size: 16px;
            font-weight: 500;
            color: #333;
            margin-bottom: 10px;
            width: 100%;
        }
        
        .about-link {
            color: #2196F3;
            text-decoration: none;
            margin-left: 5px;
        }
        
        .about-link:hover {
            text-decoration: underline;
        }
        
        .about-repo-info {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-top: 10px;
            align-items: center;
        }
        
        .about-repo-item {
            display: flex;
            align-items: center;
            padding: 5px 10px;
            background-color: #f7f7f7;
            border-radius: 4px;
            font-size: 13px;
            color: #555;
        }
        
        .about-repo-item svg {
            margin-right: 5px;
        }
        
        .qrcode-flex-container {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: flex-start;
            margin: 10px 0;
        }
        
        .qrcode-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            max-width: 220px;
        }
        
        .qrcode-item-title {
            font-size: 14px;
            font-weight: 500;
            color: #444;
            text-align: center;
            margin-bottom: 8px;
            height: 40px;
            display: flex;
            align-items: center;
        }
        
        /* GitHub 徽标样式 */
        .github-badge {
            display: flex;
            align-items: center;
            border-radius: 3px;
            overflow: hidden;
            font-size: 13px;
            text-decoration: none;
            transition: transform 0.2s ease;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12);
        }
        
        .github-badge:hover {
            transform: translateY(-2px);
        }
        
        .github-badge-left {
            background-color: #24292e;
            color: #fff;
            display: flex;
            align-items: center;
            padding: 6px 10px;
            font-weight: 600;
        }
        
        .github-badge-right {
            background-color: #0366d6;
            color: #fff;
            padding: 6px 10px;
            font-weight: 600;
            position: relative;
            display: flex;
            align-items: center;
        }

        .github-badge-right .star-count {
            margin-right: 5px;
            font-weight: 600;
            font-size: 14px;
        }
        
        .github-badge-right .star-me-text {
            font-size: 11px;
            font-weight: normal;
            color: rgba(255, 255, 255, 0.65);
        }
        
        .star-me-link {
            color: #0366d6;
            text-decoration: none;
            font-size: 13px;
            margin-left: 8px;
            padding: 4px 8px;
            border-radius: 3px;
            border: 1px solid #0366d6;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
        }
        
        .star-me-link:hover {
            background-color: #0366d6;
            color: white;
        }
        
        .star-me-link svg {
            margin-right: 4px;
            font-size: 14px;
        }
        
        .github-star-me {
            color: #888;
            font-size: 12px;
            margin-left: 10px;
        }
        
        /* 问题反馈按钮样式 */
        .feedback-button {
            display: inline-flex;
            align-items: center;
            background-color: #28a745;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.2s ease;
            margin-top: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .feedback-button:hover, 
        .feedback-button:visited:hover {
            background-color: #218838;
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            transform: translateY(-2px);
            color: white;
            text-decoration: none;
        }
        
        .feedback-button:visited {
            color: white;
            background-color: #28a745;
            text-decoration: none;
        }
        
        .feedback-button:active, 
        .feedback-button:visited:active {
            transform: translateY(1px);
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            background-color: #218838;
            color: white;
            text-decoration: none;
        }
        
        .feedback-button:focus, 
        .feedback-button:visited:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.3);
            color: white;
            text-decoration: none;
        }
        
        .feedback-button svg {
            margin-right: 8px;
        }
        `;
        
        this.appendStyles();
        
        // 订阅语言更新事件
        LanguageEventManager.getInstance().subscribe(this.componentId, this.updateLanguage.bind(this));
    }

    /**
     * 添加样式到页面
     */
    private appendStyles(): void {
        if (document.getElementById('about-component-style')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'about-component-style';
        style.type = 'text/css';
        style.appendChild(document.createTextNode(this.styleCSS));
        document.head.appendChild(style);
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
            console.error('获取GitHub仓库star数量失败:', error);
            
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
            console.error('读取缓存失败:', e);
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
            console.error('保存缓存失败:', e);
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
                        <span class="star-count">${this.repoStars}</span>
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
        
        // 添加QQ群二维码
        const qqGroup = this.createElement('div', 'qrcode-item');
        const qqTitle = this.createElement('div', 'qrcode-item-title');
        qqTitle.textContent = language?.about.group.qqGroup || 'QQ Group';
        const qqQrcode = document.createElement('img');
        qqQrcode.src = 'https://example.com/qq-group-qr.png';
        qqQrcode.alt = 'QQ Group QR Code';
        qqQrcode.className = 'about-qrcode';
        qqGroup.appendChild(qqTitle);
        qqGroup.appendChild(qqQrcode);
        qrcodeContainer.appendChild(qqGroup);
        
        // 添加微信群二维码
        const wechatGroup = this.createElement('div', 'qrcode-item');
        const wechatTitle = this.createElement('div', 'qrcode-item-title');
        wechatTitle.textContent = language?.about.group.wechatGroup || 'WeChat Group';
        const wechatQrcode = document.createElement('img');
        wechatQrcode.src = 'https://example.com/wechat-group-qr.png';
        wechatQrcode.alt = 'WeChat Group QR Code';
        wechatQrcode.className = 'about-qrcode';
        wechatGroup.appendChild(wechatTitle);
        wechatGroup.appendChild(wechatQrcode);
        qrcodeContainer.appendChild(wechatGroup);
        
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
            if (feedbackTitle) feedbackTitle.textContent = language.about.feedback.title;
            if (feedbackContent) feedbackContent.textContent = language.about.feedback.content;
            
            // 更新项目信息部分
            const projectTitle = this.containerElement.querySelector('.about-section:nth-child(2) .about-title');
            const starMeText = this.containerElement.querySelector('.star-me-text');
            if (projectTitle) projectTitle.textContent = language.about.project.title;
            if (starMeText) starMeText.textContent = language.about.project.starMe;
            
            // 更新群组信息部分
            const groupTitle = this.containerElement.querySelector('.about-section:nth-child(3) .about-title');
            const groupContent = this.containerElement.querySelector('.about-section:nth-child(3) .about-content');
            const qqTitle = this.containerElement.querySelector('.qrcode-item:nth-child(1) .qrcode-item-title');
            const wechatTitle = this.containerElement.querySelector('.qrcode-item:nth-child(2) .qrcode-item-title');
            if (groupTitle) groupTitle.textContent = language.about.group.title;
            if (groupContent) groupContent.textContent = language.about.group.content;
            if (qqTitle) qqTitle.textContent = language.about.group.qqGroup;
            if (wechatTitle) wechatTitle.textContent = language.about.group.wechatGroup;
            
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