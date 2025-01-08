/**
 * 参数加密分析器类，用于检测输入参数的加密类型。
 */
class ParamEncryptionAnalyzer {

    /**
     * 分析参数的加密类型。
     * @param {Param} param - 需要分析的参数对象，包含一个 `value` 属性。
     * @returns {string|null} 返回检测到的加密类型，如果无法识别则返回 `null`。
     */
    analyze(param) {
        return this.detectEncryptionType(param.value);
    }

    /**
     * 检测输入字符串的加密类型。
     * @param {string} input - 需要检测的输入字符串。
     * @returns {string|null} 返回检测到的加密类型，如果无法识别则返回 `null`。
     */
    detectEncryptionType(input) {

        // 如果输入为空，直接返回 null
        if (!input) {
            return null;
        }

        // // Base64 编码检测
        // const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
        // if (base64Regex.test(input) && input.length % 4 === 0) {
        //     return "Base64";
        // }

        // MD5 哈希检测
        const md5Regex = /^[a-f0-9]{32}$/i;
        if (md5Regex.test(input)) {
            return "MD5";
        }

        // SHA-1 哈希检测
        const sha1Regex = /^[a-f0-9]{40}$/i;
        if (sha1Regex.test(input)) {
            return "SHA-1";
        }

        // SHA-256 哈希检测
        const sha256Regex = /^[a-f0-9]{64}$/i;
        if (sha256Regex.test(input)) {
            return "SHA-256";
        }

        // SHA-512 哈希检测
        const sha512Regex = /^[a-f0-9]{128}$/i;
        if (sha512Regex.test(input)) {
            return "SHA-512";
        }

        // bcrypt 哈希检测
        const bcryptRegex = /^\$2[aby]\$\d{2}\$[.\/A-Za-z0-9]{53}$/;
        if (bcryptRegex.test(input)) {
            return "bcrypt";
        }

        // // URL 编码检测
        // const urlEncodedRegex = /%[0-9A-Fa-f]{2}/;
        // if (urlEncodedRegex.test(input)) {
        //     return "URL Encoded";
        // }
        //
        // // Hex 编码检测
        // const hexRegex = /^[0-9A-Fa-f]+$/;
        // if (hexRegex.test(input) && input.length % 2 === 0) {
        //     return "Hex Encoded";
        // }

        // // ROT13 编码检测
        // const rot13Regex = /^[A-Za-z]+$/;
        // if (rot13Regex.test(input) && input === input.replace(/[A-Za-z]/g, function (c) {
        //     return String.fromCharCode(c.charCodeAt(0) + (c.toLowerCase() < 'n' ? 13 : -13));
        // })) {
        //     return "ROT13";
        // }

        // // JWT (JSON Web Token) 检测
        // const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
        // if (jwtRegex.test(input)) {
        //     return "JWT";
        // }

        // UUID 检测
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(input)) {
            return "UUID";
        }

        // 如果以上所有加密类型都不匹配，返回 null 表示未知加密类型
        return null;
    }

}

// 导出 ParamEncryptionAnalyzer 类
module.exports = {
    ParamEncryptionAnalyzer
}