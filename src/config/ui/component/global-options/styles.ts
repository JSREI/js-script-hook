/**
 * 全局选项组件的CSS样式
 */
export const globalOptionsStyles = `
/* 问号提示图标样式 */
.js-script-hook-tips-icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 50%;
    background-color: #eee;
    color: #666;
    cursor: help;
    margin-right: 5px;
    position: relative;
    font-weight: bold;
}

.js-script-hook-tips-icon:hover {
    background-color: #ddd;
}

/* 问号提示内容 */
.js-script-hook-tooltip {
    display: none;
    position: absolute;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px;
    border-radius: 5px;
    width: 300px;
    top: -5px;
    left: 25px;
    font-weight: normal;
    text-align: left;
    font-size: 12px;
}

.js-script-hook-tips-icon:hover .js-script-hook-tooltip {
    display: block;
}

/* 表单样式 */
.global-options-fieldset {
    border: 1px solid #AAA;
    margin: 15px 0;
    padding: 15px;
    width: 780px;
    border-radius: 6px;
    background-color: #fcfcfc;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    transition: box-shadow 0.2s ease;
}

.global-options-fieldset:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.global-options-legend {
    color: #666;
    font-weight: 500;
    padding: 0 10px;
    font-size: 14px;
}

.global-options-table {
    width: 100%;
    border-spacing: 0;
}

.global-options-table td {
    padding: 8px;
    vertical-align: middle;
}

.global-options-table td[align="right"] {
    width: 200px;
    text-align: right;
    padding-right: 15px;
}

.global-options-table td[align="left"] {
    text-align: left;
    padding-left: 15px;
}
`; 