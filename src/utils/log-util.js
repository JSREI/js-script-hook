/**
 *
 *
 *
 * @param messageAndStyleArray
 * @return {string}
 */
function genFormatArray(messageAndStyleArray) {
    const formatArray = [];
    for (let i = 0, end = messageAndStyleArray.length / 2; i < end; i++) {
        formatArray.push("%c%s");
    }
    return formatArray.join("");
}

module.exports = {
    genFormatArray
}