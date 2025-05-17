import { jQuery as $, JQuery } from './utils/jquery-adapter';
import { type Language } from './language';

/**
 * 关于页面组件
 */
export class AboutComponent {
    private readonly styleCSS: string;
    private repoStars: number = 0;
    private readonly repoOwner: string = 'JSREI';
    private readonly repoName: string = 'js-script-hook';
    private readonly cacheKey: string = 'js_script_hook_github_stars_cache';
    private readonly cacheExpiry: number = 3600000; // 1小时的毫秒数

    constructor() {
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
            color: rgba(255, 255, 255, 0.65);  /* 更加透明的白色，在蓝色背景上显示为明显的灰色 */
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
     * 渲染关于组件
     * @param language 语言配置
     * @returns jQuery对象
     */
    public render(language?: Language): JQuery<HTMLElement> {
        this.appendStyles();

        const container = $('<div class="about-container"></div>');

        // 问题反馈部分 (放在最上面)
        const feedbackSection = $('<div class="about-section"></div>');
        feedbackSection.append(`<h2 class="about-title">${language?.about?.feedbackTitle || '问题反馈'}</h2>`);
        
        const feedbackContent = $('<div class="about-content"></div>');
        feedbackContent.append(`<p>${language?.about?.feedbackDescription || '当您遇到问题或有改进建议时，欢迎通过GitHub Issue反馈。我们将尽快处理您的问题。'}</p>`);
        
        // 添加提交Issue按钮
        const submitIssueBtn = $(`
            <a href="https://github.com/${this.repoOwner}/${this.repoName}/issues/new" target="_blank" class="feedback-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path fill-rule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"></path>
                </svg>
                ${language?.about?.submitIssue || '提交Issue'}
            </a>
        `);
        
        feedbackContent.append(submitIssueBtn);
        feedbackSection.append(feedbackContent);
        container.append(feedbackSection);

        // 项目信息部分
        const projectSection = $('<div class="about-section"></div>');
        projectSection.append(`<h2 class="about-title">${language?.about?.projectInfoTitle || '项目信息'}</h2>`);
        
        const projectContent = $('<div class="about-content"></div>');
        projectContent.append(`<p>${language?.about?.projectDescription || 'JS-Script-Hook 是一个用于Hook网站Script脚本请求和响应的工具，可以帮助开发者和安全研究人员分析和调试网站JavaScript代码。'}</p>`);
        
        // 创建包含GitHub徽标和许可证的容器，确保它们在一行显示
        const repoInfoContainer = $('<div class="about-repo-info" style="flex-wrap: nowrap;"></div>');
        
        // GitHub徽标部分
        const githubBadge = $(`
            <a href="https://github.com/${this.repoOwner}/${this.repoName}" target="_blank" class="github-badge">
                <div class="github-badge-left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" style="margin-right: 6px;">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                </div>
                <div class="github-badge-right">
                    <span class="star-count">⭐️<span id="github-star-count">${this.repoStars}</span></span>
                    <span class="star-me-text">（${language?.about?.starMeOnGithub || 'Star me on GitHub'}）</span>
                </div>
            </a>
        `);
        
        // 许可证信息
        const licenseInfo = $(`
            <span class="about-repo-item" style="margin: 0 0 0 15px; white-space: nowrap;">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M7.75 0a.75.75 0 01.75.75V3h3.634c.414 0 .814.147 1.13.414l2.07 1.75a1.75 1.75 0 010 2.672l-2.07 1.75a1.75 1.75 0 01-1.13.414H8.5v5.25a.75.75 0 11-1.5 0V10H2.75A1.75 1.75 0 011 8.25v-3.5C1 3.784 1.784 3 2.75 3H7V.75A.75.75 0 017.75 0zm0 8.5h4.384a.25.25 0 00.161-.06l2.07-1.75a.25.25 0 000-.38l-2.07-1.75a.25.25 0 00-.161-.06H2.75a.25.25 0 00-.25.25v3.5c0 .138.112.25.25.25h5z"></path>
                </svg>
                ${language?.about?.licenseLabel || '许可证: MIT'}
            </span>
        `);
        
        // 将GitHub徽标和许可证信息添加到同一个容器，确保它们在同一行
        repoInfoContainer.append(githubBadge);
        repoInfoContainer.append(licenseInfo);
        
        // 添加到内容区
        projectContent.append(repoInfoContainer);
        projectSection.append(projectContent);
        container.append(projectSection);

        // 交流群信息
        const groupSection = $('<div class="about-section"></div>');
        groupSection.append(`<h2 class="about-title">${language?.about?.groupTitle || '逆向技术交流群'}</h2>`);
        
        const groupContent = $('<div class="about-content"></div>');
        
        // 创建水平排列的容器
        const qrcodeFlexContainer = $('<div class="qrcode-flex-container"></div>');
        
        // 微信交流群
        const wxGroupItem = $('<div class="qrcode-item"></div>');
        wxGroupItem.append(`<div class="qrcode-item-title">${language?.about?.wechatGroupScanTips || '扫码加入逆向技术交流群'}</div>`);
        wxGroupItem.append('<img src="https://cdn.jsdelivr.net/gh/JSREI/.github/profile/README.assets/image-20241016230653669.png" class="about-qrcode" alt="微信交流群">');
        qrcodeFlexContainer.append(wxGroupItem);
        
        // 个人微信
        const wxPersonalItem = $('<div class="qrcode-item"></div>');
        wxPersonalItem.append(`<div class="qrcode-item-title">${language?.about?.wechatPersonalScanTips || '加我微信，发送【逆向群】拉你进群'}</div>`);
        wxPersonalItem.append('<img src="https://cdn.jsdelivr.net/gh/JSREI/.github/profile/README.assets/image-20231030132026541-7614065.png" class="about-qrcode" alt="个人微信">');
        qrcodeFlexContainer.append(wxPersonalItem);
        
        // Telegram群
        const tgGroupItem = $('<div class="qrcode-item"></div>');
        tgGroupItem.append(`<div class="qrcode-item-title">${language?.about?.telegramGroupScanTips || '扫码或'}<a href="https://t.me/jsreijsrei" target="_blank" class="about-link">${language?.about?.clickHere || '点此'}</a>${language?.about?.telegramJoinGroup || '加入TG交流群'}</div>`);
        tgGroupItem.append('<img src="https://cdn.jsdelivr.net/gh/JSREI/.github/profile/README.assets/image-20241016231143315.png" class="about-qrcode" alt="Telegram群">');
        qrcodeFlexContainer.append(tgGroupItem);
        
        groupContent.append(qrcodeFlexContainer);
        groupSection.append(groupContent);
        container.append(groupSection);

        // 作者和组织信息
        const orgSection = $('<div class="about-section"></div>');
        orgSection.append(`<h2 class="about-title">${language?.about?.organizationTitle || '关于JSREI组织'}</h2>`);
        
        const orgContent = $('<div class="about-content"></div>');
        orgContent.append(`<p>${language?.about?.organizationDescription1 || 'JSREI (JavaScript Reverse Engineering Institute) 是一个致力于JavaScript逆向工程、Web安全研究的开源技术社区。'}</p>`);
        orgContent.append(`<p>${language?.about?.organizationDescription2 || '我们专注于JavaScript代码分析、脱壳、混淆还原、浏览器指纹、Hook技术等方面的研究和工具开发。'}</p>`);
        orgContent.append(`<p>${language?.about?.organizationDescription3 || '欢迎对JavaScript逆向工程感兴趣的开发者加入我们的社区，一起交流学习。'}</p>`);
        orgContent.append(`<p>${language?.about?.organizationGithub || 'GitHub组织:'} <a href="https://github.com/JSREI" target="_blank" class="about-link">https://github.com/JSREI</a></p>`);
        
        orgSection.append(orgContent);
        container.append(orgSection);
        
        // 在组件挂载后获取star数
        setTimeout(() => {
            this.fetchRepoStars();
        }, 100);

        return container;
    }
} 