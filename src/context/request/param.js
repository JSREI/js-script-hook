/**
 * 表示url路径中的一个参数，对于script类型的请求来说，它只有query string类型的参数，因为它无法携带请求体
 */
class Param {

    /**
     *
     * @param name 参数的名字
     * @param value 参数的值
     * @param isJsonpCallback 此参数是否是jsonp的回调函数名称，有可能会识别不准
     */
    constructor(name, value, isJsonpCallback) {

        // 参数名和值
        this.name = name;
        this.value = value;

        // 这个参数是否是jsonp的回调函数
        this.isJsonpCallback = isJsonpCallback || false;

        // 此参数是jsonp的callback参数的可能性有多大
        this.jsonpCallbackScore = 0;

    }

}

module.exports = {
    Param
}
