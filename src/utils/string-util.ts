/**
 * 将字符串重复指定次数并拼接成一个新字符串。
 *
 * @param s - 需要重复的字符串。
 * @param times - 重复的次数。
 * @returns 返回重复拼接后的字符串。
 */
export function repeat(s: string, times: number): string {
    const msgs: string[] = [];
    for (let i = 0; i < times; i++) {
        msgs.push(s);
    }
    return msgs.join("");
}

/**
 * 将字符串填充到指定长度。如果字符串长度不足，则在末尾填充空格。
 *
 * @param s - 需要填充的字符串。
 * @param length - 目标长度。
 * @returns 返回填充后的字符串。如果字符串长度已经大于或等于目标长度，则返回原字符串。
 */
export function fillToLength(s: string, length: number): string {
    if (s.length >= length) {
        return s;
    } else {
        return s + repeat(" ", length - s.length);
    }
} 