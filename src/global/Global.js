/**
 * 全局变量
 */
class Global {

    /**
     * 获取全局变量 window
     *
     * @return {{}|Window}
     */
    static getWindow() {
        if (window) {
            return window;
        }
        if (global) {
            return global;
        }
        return {};
    }
}

module.exports = {
    Global
}
