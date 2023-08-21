/**
 * 用于为dom添加hook
 */
import {ScriptHook} from "./ScriptHook";

/**
 * 用于为document添加hook
 */
class DocumentHook {

    constructor(document) {
        this.document = document;
        this.documentCreateHolder = document.createElement;
    }

    addHook() {
        this.document.createElement = function () {
            const result = this.documentCreateHolder.apply(this, arguments);
            if (arguments.length && arguments[0].toLowerCase() === "script") {
                new ScriptHook(result).addHook();
            }
            return result;
        }
    }

}

module.exports = {
    DocumentHook
}
