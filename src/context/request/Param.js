/**
 * 表示url路径中的一个参数
 */
class Param {

    /**
     *
     * @param name 参数的名字
     * @param value 参数的值
     * @param isJsonpCallback 此参数是否是jsonp的回调函数名称
     */
    constructor(name, value, isJsonpCallback) {
        this.name = name;
        this.value = value;
        this.isJsonpCallback = isJsonpCallback || false;
    }

}

module.exports = {
    Param
}
