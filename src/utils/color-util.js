/**
 * 生成一个随机的 RGB 颜色值。
 *
 * @return {string} - 返回一个表示 RGB 颜色的字符串，格式为 `rgb(r, g, b)`，其中 `r`、`g`、`b` 分别是 0 到 255 之间的随机整数。
 */
function getRandomRGBColor() {
    const r = Math.floor(Math.random() * 256); // 红色分量 (0-255)
    const g = Math.floor(Math.random() * 256); // 绿色分量 (0-255)
    const b = Math.floor(Math.random() * 256); // 蓝色分量 (0-255)
    return `rgb(${r}, ${g}, ${b})`;
}

module.exports = {
    getRandomRGBColor
};