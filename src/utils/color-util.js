function getRandomRGBColor() {
    const r = Math.floor(Math.random() * 256); // 红色分量 (0-255)
    const g = Math.floor(Math.random() * 256); // 绿色分量 (0-255)
    const b = Math.floor(Math.random() * 256); // 蓝色分量 (0-255)
    return `rgb(${r}, ${g}, ${b})`;
}

module.exports = {
    getRandomRGBColor
}