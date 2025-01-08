const {getLanguage, chinese} = require("../config/ui/component/language");
const {fillToLength} = require("../utils/string-util");
const {genFormatArray} = require("../utils/log-util");
const {getGlobalConfig} = require("../config/config");
const {highlightJSON} = require("./json-formatter");
const {getUserCodeLocation} = require("../utils/code-util");
const {printStyledTable} = require("./table-formatter");

/**
 * 用于对响应进行格式化
 */
class ResponseFormatter {

    /**
     *
     * @param scriptContext {ScriptContext}
     */
    format(scriptContext) {

        const codeLocation = getUserCodeLocation();

        const responseContext = scriptContext.responseContext;
        const requestContext = scriptContext.requestContext;
        // const language = getLanguage(getGlobalConfig().language);
        const language = chinese;

        const data = [
            // TODO 2025-01-08 01:28:26 国际化
            ["名称", "值", "备注"],
            [language.console.time, new Date().toLocaleString(), ""],
            [language.console.requestId, scriptContext.requestId, ""],
            [language.console.isJsonpRequest, scriptContext.isJsonp(), ""],
            [language.console.hostname, requestContext.hostname, ""],
            [language.console.path, requestContext.path, ""],
            [language.console.hash, requestContext.hash, ""],
            [language.console.codeLocation, codeLocation, ""],
            // [language.console.param, requestContext.params.length],
        ];
        // 示例样式
        const styles = {
            borderColor: '#000',
            cellBackgroundColor: '#f0f0f0',
            fontSize: '14px',
            fontColor: '#333'
        };

        // 打印表格
        const title = language.console.titleResponse;
        printStyledTable(data, styles, title);
        const msgs = highlightJSON(responseContext.jsonpCallbackArguments);
        console.log(msgs);


    }

}

module.exports = {
    ResponseFormatter
}