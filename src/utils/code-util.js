/**
 *
 * 获取函数的方法体代码
 *
 * @param fn
 * @return {string}
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
 * 获取函数的参数名
 *
 * @param fn
 * @return {string[]|*[]}
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
 * 生成一个随机的函数名
 *
 * @param length
 * @return {string}
 */
function generateRandomFunctionName(length = 8) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

module.exports = {
    getFunctionBody,
    getParameterNames,
    generateRandomFunctionName,
}