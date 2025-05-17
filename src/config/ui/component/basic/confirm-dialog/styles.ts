/**
 * 确认对话框组件的CSS样式
 */
export const confirmDialogStyles = `
.js-script-hook-confirm-overlay {
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

.js-script-hook-confirm-dialog {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    width: 400px;
    max-width: 90%;
    overflow: hidden;
    animation: js-script-hook-confirm-appear 0.2s ease-out;
}

@keyframes js-script-hook-confirm-appear {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.js-script-hook-confirm-header {
    background-color: #f5f5f5;
    padding: 15px 20px;
    font-weight: 500;
    font-size: 16px;
    color: #333;
    border-bottom: 1px solid #eee;
}

.js-script-hook-confirm-body {
    padding: 20px;
    color: #555;
    font-size: 14px;
    line-height: 1.5;
}

.js-script-hook-confirm-footer {
    display: flex;
    justify-content: flex-end;
    padding: 15px 20px;
    background-color: #fafafa;
    border-top: 1px solid #eee;
}

.js-script-hook-confirm-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
    margin-left: 10px;
}

.js-script-hook-confirm-cancel-btn {
    background-color: #f5f5f5;
    color: #666;
}

.js-script-hook-confirm-cancel-btn:hover {
    background-color: #eee;
}

.js-script-hook-confirm-ok-btn {
    background-color: #f44336;
    color: white;
}

.js-script-hook-confirm-ok-btn:hover {
    background-color: #e53935;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.js-script-hook-dialog-icon {
    display: inline-block;
    margin-right: 10px;
    color: #f44336;
}
`; 