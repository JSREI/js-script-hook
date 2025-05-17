/**
 * 调试器管理器组件的CSS样式
 */
export const debuggerManagerStyles = `
/* 添加断点按钮样式 */
#js-script-hook-add-debugger-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 780px;
    height: 80px;
    margin: 15px 0;
    border: 2px dashed #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
    color: #666;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s ease;
}

#js-script-hook-add-debugger-btn:hover {
    border-color: #66bb6a;
    background-color: #f0f7f0;
    color: #43a047;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

#js-script-hook-add-debugger-btn .plus-icon {
    font-size: 24px;
    margin-right: 10px;
    font-weight: 300;
}

/* 断点列表容器 */
#js-script-hook-debugger-list {
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* 圆形序号样式 */
.js-script-hook-circle-number {
    display: inline-block;
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    border-radius: 50%;
    background-color: #eee;
    color: #666;
    margin-right: 10px;
    font-weight: bold;
}

#js-script-hook-add-debugger {
    display: flex;
    justify-content: center;
}
`; 