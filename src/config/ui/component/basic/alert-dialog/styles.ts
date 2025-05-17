/**
 * AlertDialog组件的CSS样式
 */
export const alertDialogStyles = `
    .js-script-hook-alert-overlay {
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
    
    .js-script-hook-alert-dialog {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        width: 400px;
        max-width: 90%;
        overflow: hidden;
        animation: js-script-hook-alert-appear 0.2s ease-out;
    }
    
    @keyframes js-script-hook-alert-appear {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .js-script-hook-alert-header {
        background-color: #f5f5f5;
        padding: 15px 20px;
        font-weight: 500;
        font-size: 16px;
        color: #333;
        border-bottom: 1px solid #eee;
    }
    
    .js-script-hook-alert-body {
        padding: 20px;
        color: #555;
        font-size: 14px;
        line-height: 1.5;
    }
    
    .js-script-hook-alert-footer {
        display: flex;
        justify-content: center;
        padding: 15px 20px;
        background-color: #fafafa;
        border-top: 1px solid #eee;
    }
    
    .js-script-hook-alert-btn {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
        background-color: #2196F3;
        color: white;
    }
    
    .js-script-hook-alert-btn:hover {
        background-color: #1e88e5;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .js-script-hook-alert-icon {
        display: inline-block;
        margin-right: 10px;
        color: #2196F3;
    }
`; 