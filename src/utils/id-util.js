/**
 * 生成一个随机 ID，格式类似于 UUID。
 *
 * @returns {string} - 返回一个随机生成的 ID，格式为 "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"。
 */
function randomId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        // 生成一个 0 到 15 的随机整数
        const r = Math.random() * 16 | 0;
        // 如果字符是 'x'，则直接使用随机数；如果是 'y'，则根据规则生成特定值
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        // 将结果转换为十六进制字符串
        return v.toString(16);
    });
}

module.exports = {
    randomId
};