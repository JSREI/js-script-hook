const {getGlobalConfig} = require("../config/config");

/**
 * 为全局的函数添加Hook，因为是要在新的script中调用，所以这些jsonp函数声明的都是全局作用域
 */
class ObjectFunctionHook {

    /**
     *
     * @param object
     * @param functionName
     */
    constructor(object, functionName) {
        this.object = object;
        this.functionName = functionName;
    }

    /**
     *
     * @param hookCallbackFunction
     */
    addHook(hookCallbackFunction) {

        // 要Hook的函数必须存在
        const functionHolder = this.object[this.functionName];
        if (!functionHolder) {
            // TODO 2024-12-20 01:04:00 统一日志
            console.log(`hook失败，函数不存在： ${this.functionName}`);
            return;
        }

        // 如果已经Hook过了则不重复hook，也就是说一次addHook只生效一次
        // TODO 2025-01-06 03:19:19 修改为读取配置中的前缀
        // const prefix = getGlobalConfig().prefix || "CC11001100_js_script_hook"
        const prefix = "CC11001100_js_script_hook"
        const hookDoneFlag = prefix + "_hookDoneFlag";
        if (functionHolder[hookDoneFlag]) {
            return;
        }

        // 为函数添加Hook
        this.object[this.functionName] = function () {

            try {
                // TODO 2023-8-21 22:15:09 在函数执行的时候尝试触发各种断点
                hookCallbackFunction.apply(this, arguments)
            } catch (e) {
                console.error(e);
            }

            return functionHolder.apply(this, arguments);
        }
        // 设置标记位，防止重复Hook
        this.object[this.functionName][hookDoneFlag] = true;
    }

}

module.exports = {
    ObjectFunctionHook
}
