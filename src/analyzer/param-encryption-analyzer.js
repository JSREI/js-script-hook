/**
 * 分析参数加密
 */
class ParamEncryptionAnalyzer {

    /**
     *
     * @param param {Param}
     */
    analyze(param) {
        return this.detectEncryptionType(param.value);
    }

    detectEncryptionType(input) {
        // Base64
        const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
        if (base64Regex.test(input) && input.length % 4 === 0) {
            return "Base64";
        }

        // MD5
        const md5Regex = /^[a-f0-9]{32}$/i;
        if (md5Regex.test(input)) {
            return "MD5";
        }

        // SHA-1
        const sha1Regex = /^[a-f0-9]{40}$/i;
        if (sha1Regex.test(input)) {
            return "SHA-1";
        }

        // SHA-256
        const sha256Regex = /^[a-f0-9]{64}$/i;
        if (sha256Regex.test(input)) {
            return "SHA-256";
        }

        // SHA-512
        const sha512Regex = /^[a-f0-9]{128}$/i;
        if (sha512Regex.test(input)) {
            return "SHA-512";
        }

        // bcrypt
        const bcryptRegex = /^\$2[aby]\$\d{2}\$[.\/A-Za-z0-9]{53}$/;
        if (bcryptRegex.test(input)) {
            return "bcrypt";
        }

        // URL编码
        const urlEncodedRegex = /%[0-9A-Fa-f]{2}/;
        if (urlEncodedRegex.test(input)) {
            return "URL Encoded";
        }

        // Hex编码
        const hexRegex = /^[0-9A-Fa-f]+$/;
        if (hexRegex.test(input) && input.length % 2 === 0) {
            return "Hex Encoded";
        }

        // ROT13
        const rot13Regex = /^[A-Za-z]+$/;
        if (rot13Regex.test(input) && input === input.replace(/[A-Za-z]/g, function (c) {
            return String.fromCharCode(c.charCodeAt(0) + (c.toLowerCase() < 'n' ? 13 : -13));
        })) {
            return "ROT13";
        }

        // JWT
        const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
        if (jwtRegex.test(input)) {
            return "JWT";
        }

        // UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(input)) {
            return "UUID";
        }

        // 如果都不匹配，返回未知
        return null;
    }

// // 测试示例
//     console.log(detectEncryptionType("SGVsbG8gV29ybGQ=")); // Base64
//     console.log(detectEncryptionType("5d41402abc4b2a76b9719d911017c592")); // MD5
//     console.log(detectEncryptionType("2fd4e1c67a2d28fced849ee1bb76e7391b93eb12")); // SHA-1
//     console.log(detectEncryptionType("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855")); // SHA-256
//     console.log(detectEncryptionType("$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy")); // bcrypt
//     console.log(detectEncryptionType("Hello%20World")); // URL Encoded
//     console.log(detectEncryptionType("48656c6c6f20576f726c64")); // Hex Encoded
//     console.log(detectEncryptionType("Uryyb Jbeyq")); // ROT13
//     console.log(detectEncryptionType("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c")); // JWT
//     console.log(detectEncryptionType("550e8400-e29b-41d4-a716-446655440000")); // UUID
//     console.log(detectEncryptionType("randomstring")); // Unknown Encryption Type

}


module.exports = {
    ParamEncryptionAnalyzer
}