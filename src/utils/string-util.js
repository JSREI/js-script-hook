/**
 *
 * @param s
 * @param times
 * @return {string}
 */
function repeat(s, times) {
    const msgs = [];
    for (let i = 0; i < times; i++) {
        msgs.push(s);
    }
    return msgs.join("");
}

module.exports = {
    repeat
}