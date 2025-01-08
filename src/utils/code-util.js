/**
 * 获取函数的方法体代码。
 *
 * @param {Function} fn - 要提取方法体的函数。
 * @return {string} - 返回函数的方法体代码。
 * @throws {TypeError} - 如果传入的参数不是函数，则抛出 TypeError。
 */
function getFunctionBody(fn) {
    if (typeof fn !== 'function') {
        throw new TypeError('Expected a function');
    }

    // 获取函数的完整代码
    const fullCode = fn.toString();

    // 提取方法体的代码
    const bodyStart = fullCode.indexOf('{') + 1; // 找到方法体的开始位置
    const bodyEnd = fullCode.lastIndexOf('}');   // 找到方法体的结束位置

    // 提取并返回方法体的代码
    return fullCode.slice(bodyStart, bodyEnd).trim();
}

/**
 * 获取函数的参数名。
 *
 * @param {Function} fn - 要提取参数名的函数。
 * @return {string[]} - 返回函数的参数名数组。如果没有参数，则返回空数组。
 * @throws {TypeError} - 如果传入的参数不是函数，则抛出 TypeError。
 */
function getParameterNames(fn) {
    if (typeof fn !== 'function') {
        throw new TypeError('Expected a function');
    }

    // 将函数转换为字符串
    const fnStr = fn.toString();

    // 提取参数部分
    const paramPattern = /\(([^)]*)\)/;
    const match = fnStr.match(paramPattern);

    if (!match || !match[1]) {
        return []; // 如果没有参数，返回空数组
    }

    // 提取参数名称
    const paramNames = match[1]
        .split(',')
        .map(param => param.trim())
        .filter(param => param); // 过滤掉空字符串

    return paramNames;
}

/**
 * 生成一个随机的函数名。
 *
 * @param {number} [length=8] - 函数名的长度，默认为 8。
 * @return {string} - 返回生成的随机函数名。
 */
function generateRandomFunctionName(length = 8) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

const tampermonkeyChromeExtensionId = "dhdgffkkebhmkfjojejmpbldmpobfkfo";

/**
 * 获取用户代码的位置，用户代码的定义就是调用栈里从用户的代码进入到插件代码的第一行代码
 */
function getUserCodeLocation() {

    // 把调用栈一个栈帧一个栈帧的弹掉
    const stack = new Error().stack.split("\n");
    let index = stack.length - 1;
    while (index >= 0) {
        const frame = stack[index];
        if (frame.includes(tampermonkeyChromeExtensionId) && index < stack.length) {
            return stack[index + 1].trim();
        } else {
            index--;
        }
    }
    return null;
}

module.exports = {
    getFunctionBody,
    getParameterNames,
    generateRandomFunctionName,
    getUserCodeLocation,
};