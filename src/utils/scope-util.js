/**
 *
 * 在油猴脚本内部的沙箱机制，不让修改window上的变量，要修改的话需要通过 unsafeWindow，需要修改的地方全局调用此方法获取，这样后面方便知道都有哪些地方用到了unsafeWindow
 *
 * https://wiki.greasespot.net/UnsafeWindow
 *
 * @returns {*}
 */
function getUnsafeWindow() {
    return unsafeWindow;
}

module.exports = {
    getUnsafeWindow,
}