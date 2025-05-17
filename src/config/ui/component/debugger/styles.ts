/**
 * 调试器组件的CSS样式
 */
export const debuggerStyles = `
.debugger-component-fieldset {
    width: 780px;
    border: 1px solid #ddd;
    border-radius: 6px;
    margin: 15px 0;
    padding: 15px;
    position: relative;
    background-color: #fcfcfc;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    transition: box-shadow 0.2s ease;
}

.debugger-component-fieldset:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.debugger-component-legend {
    color: #666;
    font-weight: 500;
    padding: 0 10px;
    font-size: 14px;
}

.debugger-component-remove-btn {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #aaa;
    background-color: white;
    border-radius: 50%;
    font-size: 14px;
    color: #888;
    cursor: pointer;
    transition: all 0.2s ease;
    opacity: 0.7;
}

.debugger-component-remove-btn:hover {
    color: #555;
    background-color: #f5f5f5;
    border-color: #777;
    opacity: 1;
}

.debugger-component-table {
    width: 100%;
    border-spacing: 0;
}

.debugger-component-table td {
    padding: 8px;
    vertical-align: middle;
}

.debugger-component-table td[align="right"] {
    width: 200px;
    text-align: right;
    padding-right: 15px;
}

.debugger-component-table td[align="left"] {
    text-align: left;
    padding-left: 15px;
}
`; 