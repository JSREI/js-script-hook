/**
 * 生成一个格式化字符串数组，用于 `console.log` 的多样式输出。
 *
 * 该函数接受一个包含消息和样式的数组，生成一个格式化字符串，用于将消息和样式一一对应。
 * 例如，输入 `["Hello", "color: red", "World", "color: blue"]`，输出 `"%c%s%c%s"`。
 *
 * @param {Array<string>} messageAndStyleArray - 包含消息和样式的数组。消息和样式交替出现，例如 `["消息1", "样式1", "消息2", "样式2"]`。
 * @return {string} - 返回一个格式化字符串，例如 `"%c%s%c%s"`，用于 `console.log` 的多样式输出。
 */
function genFormatArray(messageAndStyleArray) {
    const formatArray = [];
    // 遍历数组，每两个元素（消息和样式）生成一个 "%c%s"
    for (let i = 0, end = messageAndStyleArray.length / 2; i < end; i++) {
        formatArray.push("%c%s");
    }
    // 将数组拼接成一个字符串
    return formatArray.join("");
}

module.exports = {
    genFormatArray
};