const {ScriptHook} = require("./script-hook");

/**
 * 用于为document添加hook
 */
class DocumentHook {

    /**
     *
     * @param document {HTMLDocument}
     */
    constructor(document) {
        this.document = document;
        this.documentCreateHolder = document.createElement;
    }

    /**
     *
     */
    addHook() {

        const _this = this;

        this.document.createElement = function () {
            const result = _this.documentCreateHolder.apply(this, arguments);
            if (arguments.length && arguments[0].toLowerCase() === "script") {
                new ScriptHook(result).addHook();
            }
            return result;
        }

        this.document.createElement.toString = function () {
            return _this.documentCreateHolder.toString();
        }
    }

}

module.exports = {
    DocumentHook
}
