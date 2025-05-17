/**
 * 输入对话框组件的CSS样式
 */
export const inputDialogStyles = `
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