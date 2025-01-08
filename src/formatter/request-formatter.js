const {genFormatArray} = require("../utils/log-util");
const {repeat, fillToLength} = require("../utils/string-util");
const {getLanguage, getLanguageByGlobalConfig} = require("../config/ui/component/language");
const {getGlobalConfig} = require("../config/config");
const {printStyledTable} = require("./table-formatter");
const {getUserCodeLocation} = require("../utils/code-util");

/**
 * 用于第请求进行格式化
 */
class RequestFormatter {

    /**
     *
     * @param scriptContext {ScriptContext}
     */
    format(scriptContext) {

        const codeLocation = getUserCodeLocation();

        const requestContext = scriptContext.requestContext;
        const language = getLanguageByGlobalConfig();

        const data = [
            // TODO 2025-01-08 01:28:26 国际化
            [language.console.tableKey, language.console.tableValue, language.console.tableComment],
            [language.console.time, new Date().toLocaleString(), ""],
            [language.console.requestId, scriptContext.requestId, ""],
            [language.console.isJsonpRequest, scriptContext.isJsonp(), ""],
            [language.console.hostname, requestContext.hostname, ""],
            [language.console.path, requestContext.path, ""],
            [language.console.hash, requestContext.hash, ""],
            [language.console.codeLocation, codeLocation, ""],
            // [language.console.param, requestContext.params.length],
        ];

        let index = 1;
        for (let param of requestContext.params) {

            const name = `${language.console.param}(${index++}) ${param.name}`;

            let value = `${param.value}`;

            let attribute = "";
            if (param.isJsonpCallback) {
                attribute = "jsonp callback";
            } else if (param.encryptType) {
                attribute = param.encryptType;
            }

            data.push([name, value, attribute]);
        }

        // 示例样式
        const styles = {
            borderColor: '#000',
            cellBackgroundColor: '#f0f0f0',
            fontSize: '14px',
            fontColor: '#333'
        };

        // 打印表格
        const title = language.console.titleRequest;
        printStyledTable(data, styles, title);

    }

    /**
     *
     * @param language
     * @param params {Array<Param>}
     * @return {*[]}
     */
    convertParamsToTableData(language, params) {
        const tableData = [];
        for (let param of params) {
            const o = {};
            o[language.console.paramName] = param.name;
            o[language.console.paramValue] = param.value;
            o[language.console.isJsonpCallback] = param.isJsonpCallback;
            tableData.push(o);
        }
        return tableData;
    }

}

module.exports = {
    RequestFormatter
}