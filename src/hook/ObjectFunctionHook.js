/**
 * 为全局的函数添加Hook
 */
class ObjectFunctionHook {

    // 因为是要在新的script中调用，所以这些jsonp函数都是全局作用域
    constructor(object, functionName) {
        this.object = object;
        this.functionName = functionName;
    }

    addHook() {

        // 要Hook的函数必须存在
        const functionHolder = this.object[this.functionName];
        if (!functionHolder) {
            console.log(`hook失败，函数不存在： ${this.functionName}`);
            return;
        }

        // 如果已经Hook过了则不重复hook，也就是说一次addHook只生效一次
        const hookDoneFlag = "CC11001100_hookDoneFlag";
        if (functionHolder[hookDoneFlag]) {
            return;
        }

        // 为函数添加Hook
        this.object[this.functionName] = function () {
            // TODO 2023-8-21 22:15:09 在函数执行的时候尝试触发各种断点
            // 这里是脚本的响应断点，已经拦截到响应，跟进去holder函数就行了
            debugger;
            return functionHolder.apply(this, arguments);
        }
        // 设置标记位，防止重复Hook
        functionHolder[hookDoneFlag] = true;
    }

}

module.exports = {
    ObjectFunctionHook
}
