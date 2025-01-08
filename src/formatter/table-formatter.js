function printStyledTable(data, styles) {
    const { borderColor, cellBackgroundColor, fontSize, fontColor } = styles;

    // 计算每列的最大宽度
    let colWidths = data[0].map((_, colIndex) =>
        Math.max(...data.map(row => String(row[colIndex]).length))
    );

    // 定义表格的样式
    const tableStyle = `
        padding: 5px;
        font-size: ${fontSize};
        color: ${fontColor};
        background-color: ${cellBackgroundColor};
        border: 1px solid ${borderColor};
        font-family: monospace;
        white-space: pre; // 保留空格和换行
    `;

    // 构建表格内容
    let tableContent = '';

    // 表头
    tableContent += data[0]
        .map((cell, index) => cell.padEnd(colWidths[index]))
        .join(' │ ');

    // 表格内容
    for (let i = 1; i < data.length; i++) {
        tableContent += '\n' + data[i]
            .map((cell, index) => String(cell).padEnd(colWidths[index]))
            .join(' │ ');
    }

    // 打印表格
    console.log('%c' + tableContent, tableStyle);
}


module.exports = {
    printStyledTable
}