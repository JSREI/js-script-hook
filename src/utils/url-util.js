/**
 *
 * @param urlString {String} "https://example.com/path/to/page.html"
 * @return
 */
function urlBasePath(urlString) {
    const url = new URL(urlString);
    const basePath = `${url.origin}${url.pathname.substring(0, url.pathname.lastIndexOf("/") + 1)}`;
    // console.log(basePath); // 输出: https://example.com/path/to/
    return basePath;
}

/**
 *
 * 把script的src格式化，统一为url的形式
 *
 * @param scriptSrc {String}
 * @return
 */
function formatScriptSrcToUrl(scriptSrc) {

    // 强制requestUrl是一个字符串
    // 比如可能会是一个TrustedScriptURL
    scriptSrc = scriptSrc + "";

    // 正常格式直接返回
    if (scriptSrc.startsWith("http://") || scriptSrc.startsWith("https://")) {
        return scriptSrc;
    }

    // 兼容CDN URL
    // 示例："//statics.moonshot.cn/kimi-chat/shared-K0TvIN461soURJCs7nh6uxcQiCM_.04bc3959.async.js"
    if (scriptSrc.startsWith("//")) {
        return "https:" + scriptSrc;
    }

    // 相对路径： "./js/login/log-utils1.1.js"
    if (scriptSrc.startsWith("./")) {
        return urlBasePath(window.location.href) + scriptSrc.substring(2, scriptSrc.length);
    }

    // 兼容省略域名的情况
    // 数据样例："/logos/2024/moon/december-r4/december.js"
    if (scriptSrc.startsWith("/")) {
        return window.location.origin + scriptSrc;
    }

    // 相对路径
    // "static/js/chunk-19a101ae.45e69b5c.js"
    return window.location.origin + "/" + scriptSrc;
}

module.exports = {
    urlBasePath,
    formatScriptSrcToUrl,
}
