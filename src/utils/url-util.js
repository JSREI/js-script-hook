/**
 * 获取 URL 的基础路径（包括协议、域名和路径部分，但不包括文件名）。
 *
 * @param {string} urlString - 完整的 URL 字符串，例如 "https://example.com/path/to/page.html"。
 * @return {string} - 返回 URL 的基础路径，例如 "https://example.com/path/to/"。
 */
function urlBasePath(urlString) {
    const url = new URL(urlString);
    // 获取基础路径（包括协议、域名和路径部分，但不包括文件名）
    const basePath = `${url.origin}${url.pathname.substring(0, url.pathname.lastIndexOf("/") + 1)}`;
    // console.log(basePath); // 输出: https://example.com/path/to/
    return basePath;
}

/**
 * 将 script 的 src 格式化为完整的 URL。
 *
 * 支持以下格式的 script src：
 * 1. 完整的 URL（以 "http://" 或 "https://" 开头）。
 * 2. CDN URL（以 "//" 开头）。
 * 3. 相对路径（以 "./" 开头）。
 * 4. 省略域名的路径（以 "/" 开头）。
 * 5. 其他相对路径。
 *
 * @param {string} scriptSrc - script 的 src 属性值。
 * @return {string} - 返回格式化后的完整 URL。
 */
function formatScriptSrcToUrl(scriptSrc) {

    // 强制将 scriptSrc 转换为字符串（例如，处理 TrustedScriptURL 类型）
    scriptSrc = scriptSrc + "";

    // 如果已经是完整的 URL，直接返回
    if (scriptSrc.startsWith("http://") || scriptSrc.startsWith("https://")) {
        return scriptSrc;
    }

    // 处理 CDN URL（以 "//" 开头）
    // 示例："//statics.moonshot.cn/kimi-chat/shared-K0TvIN461soURJCs7nh6uxcQiCM_.04bc3959.async.js"
    if (scriptSrc.startsWith("//")) {
        return "https:" + scriptSrc;
    }

    // 处理相对路径（以 "./" 开头）
    // 示例："./js/login/log-utils1.1.js"
    if (scriptSrc.startsWith("./")) {
        return urlBasePath(window.location.href) + scriptSrc.substring(2, scriptSrc.length);
    }

    // 处理省略域名的路径（以 "/" 开头）
    // 示例："/logos/2024/moon/december-r4/december.js"
    if (scriptSrc.startsWith("/")) {
        return window.location.origin + scriptSrc;
    }

    // 处理其他相对路径
    // 示例："static/js/chunk-19a101ae.45e69b5c.js"
    return window.location.origin + "/" + scriptSrc;
}

module.exports = {
    urlBasePath,
    formatScriptSrcToUrl,
};