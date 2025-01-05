/**
 * 生成一个随机id，类似UUID的格式
 *
 * @returns {string}
 */
function randomId() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

module.exports = {
    randomId
}





