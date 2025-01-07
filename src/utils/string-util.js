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

/**
 *
 * @param s
 * @param length
 * @return {*|string}
 */
function fillToLength(s, length) {
    if (s.length >= length) {
        return s;
    } else {
        return s + repeat(" ", length - s.length);
    }
}

module.exports = {
    repeat,
    fillToLength,
}