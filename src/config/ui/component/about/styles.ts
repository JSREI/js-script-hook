/**
 * 关于页面的CSS样式
 */
export const aboutStyles = `
    .about-container {
        width: 100%;
        padding: 0 15px;
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        color: #333;
        line-height: 1.5;
    }
    
    .about-section {
        margin-bottom: 25px;
    }
    
    .about-title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 10px;
        color: #2c3e50;
        border-bottom: 1px solid #eee;
        padding-bottom: 5px;
    }
    
    .about-content {
        margin-bottom: 15px;
        color: #555;
    }
    
    .about-link {
        color: #0366d6;
        text-decoration: none;
    }
    
    .about-link:hover {
        text-decoration: underline;
    }
    
    /* GitHub 徽章 */
    .about-repo-info {
        margin: 10px 0;
    }
    
    .github-badge {
        display: inline-flex;
        align-items: center;
        text-decoration: none;
        border-radius: 3px;
        overflow: hidden;
        font-size: 12px;
        font-weight: 600;
        height: 20px;
        line-height: 20px;
    }
    
    .github-badge-left {
        display: flex;
        align-items: center;
        background-color: #24292e;
        color: white;
        padding: 0 6px;
        height: 100%;
    }
    
    .github-badge-right {
        display: flex;
        align-items: center;
        background-color: #0366d6;
        color: white;
        padding: 0 6px;
        height: 100%;
    }
    
    .star-count {
        margin-right: 4px;
    }
    
    .star-me-text {
        font-size: 11px;
    }
    
    /* 二维码容器样式 */
    .qrcode-flex-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        gap: 15px;
        margin-top: 15px;
    }
    
    .qrcode-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 15px;
    }
    
    .qrcode-item-title {
        font-weight: 600;
        margin-bottom: 8px;
        text-align: center;
        color: #2c3e50;
    }
    
    .about-qrcode {
        width: 120px;
        height: 120px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background-color: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    /* 提交Issue按钮 */
    .feedback-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: #28a745;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 12px;
        font-size: 14px;
        font-weight: 500;
        text-decoration: none;
        margin-top: 10px;
        cursor: pointer;
        transition: background-color 0.2s;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    }
    
    .feedback-button:hover {
        background-color: #218838;
        text-decoration: none;
    }
    
    .feedback-button svg {
        margin-right: 6px;
    }
    
    /* 响应式调整 */
    @media (max-width: 600px) {
        .qrcode-flex-container {
            flex-direction: column;
            align-items: center;
        }
        
        .about-qrcode {
            width: 100px;
            height: 100px;
        }
    }
`;
 