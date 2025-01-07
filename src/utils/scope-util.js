/**
 * 获取 `unsafeWindow` 对象，用于在油猴脚本中访问或修改全局 `window` 对象。
 *
 * 油猴脚本默认运行在一个沙箱环境中，无法直接修改全局 `window` 对象。
 * 通过 `unsafeWindow` 可以绕过沙箱机制，直接访问或修改全局 `window` 对象。
 * 使用此方法封装 `unsafeWindow` 的调用，便于后续追踪哪些地方使用了 `unsafeWindow`。
 *
 * @see https://wiki.greasespot.net/UnsafeWindow - 油猴脚本中 `unsafeWindow` 的官方文档。
 * @returns {Window} - 返回全局的 `unsafeWindow` 对象。
 */
function getUnsafeWindow() {
    return unsafeWindow;
}

module.exports = {
    getUnsafeWindow,
};