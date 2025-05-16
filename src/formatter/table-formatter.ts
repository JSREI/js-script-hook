export interface TableStyles {
    borderColor: string;
    cellBackgroundColor: string;
    fontSize: string;
    fontColor: string;
    titleFontSize?: string;
}

export function printStyledTable(data: Array<Array<string | boolean>>, styles: TableStyles, title: string = ''): void {
    const { borderColor, cellBackgroundColor, fontSize, fontColor, titleFontSize = '20px' } = styles;

    // 计算字符串的实际宽度（中文字符宽度为2，英文字符宽度为1）
    function getStringWidth(str: string): number {
        let width = 0;
        for (const char of str) {
            width += /[\u4e00-\u9fa5]/.test(char) ? 2 : 1; // 判断是否为中文字符
        }
        return width;
    }

    // 计算每列的最大宽度
    const colWidths = data[0].map((_, colIndex) =>
        Math.max(...data.map(row => getStringWidth(String(row[colIndex]))))
    );

    // 计算表格的总宽度
    const totalWidth = colWidths.reduce((sum, width) => sum + width + 3, 0) - 1;

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

    // 定义标题的样式（背景色和边框与表格一致）
    const titleStyle = `
        font-size: ${titleFontSize};
        font-weight: bold;
        text-align: center;
        background-color: ${cellBackgroundColor};
        border: 1px solid ${borderColor};
        padding: 5px;
    `;

    // 根据实际宽度填充字符串
    function padString(str: string, width: number): string {
        const strWidth = getStringWidth(str);
        if (strWidth >= width) return str; // 如果字符串宽度已经足够，直接返回
        const padding = ' '.repeat(width - strWidth); // 计算需要填充的空格
        return str + padding;
    }

    // 构建表格内容
    let tableContent = '';

    // 如果有标题，添加标题行
    if (title) {
        const titleWidth = getStringWidth(title);
        const leftPadding = Math.floor((totalWidth - titleWidth) / 2);
        const rightPadding = totalWidth - titleWidth - leftPadding;
        const paddedTitle = ' '.repeat(leftPadding) + title + ' '.repeat(rightPadding);
        tableContent += '%c' + paddedTitle + '\n';
    }

    // 表头
    tableContent += data[0]
        .map((cell, index) => padString(String(cell), colWidths[index]))
        .join(' │ ');

    // 表格内容
    for (let i = 1; i < data.length; i++) {
        tableContent += '\n' + data[i]
            .map((cell, index) => padString(String(cell), colWidths[index]))
            .join(' │ ');
    }

    // 打印表格
    if (title) {
        console.log('%c' + tableContent, titleStyle, tableStyle);
    } else {
        console.log('%c' + tableContent, tableStyle);
    }
} 