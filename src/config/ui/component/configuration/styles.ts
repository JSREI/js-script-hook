/**
 * 配置界面样式定义
 */
export const configurationStyles = `
/* 配置窗口基本样式 */
#jsrei-js-script-hook-configuration-modal-window {
    display: none;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.85);
    z-index: 2147483646;
    overflow-y: auto;
}

/* 可滚动区域样式 */
.js-script-hook-scrollable-div {
    width: 860px;
    padding: 30px 40px;
    margin: 10px auto;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 8px;
    box-shadow: 0 6px 16px rgba(0,0,0,0.2);
    max-width: 80%;
    z-index: 99999999999;
    max-height: 800px;
    overflow-y: auto;
}

/* 内容区居中对齐 */
#js-script-hook-configuration-content {
    color: black;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* 关闭按钮样式 */
#jsrei-js-script-hook-configuration-close-btn {
    position: absolute;
    right: 15px;
    top: 15px;
    cursor: pointer;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #999;
    background-color: white;
    border-radius: 50%;
    font-size: 24px;
    color: #888;
    transition: all 0.2s ease;
    z-index: 1000;
    transform: rotate(0deg);
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

#jsrei-js-script-hook-configuration-close-btn:hover {
    color: #555;
    background-color: #f0f0f0;
    border-color: #666;
    transform: rotate(90deg);
    box-shadow: 0 3px 7px rgba(0,0,0,0.3);
}

#jsrei-js-script-hook-configuration-close-btn:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(153, 153, 153, 0.4);
}

#jsrei-js-script-hook-configuration-close-btn:active {
    transform: scale(0.9) rotate(90deg);
}
`; 