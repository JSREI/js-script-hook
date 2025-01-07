const {genFormatArray} = require("../utils/log-util");
const {repeat, fillToLength} = require("../utils/string-util");
const {getLanguage} = require("../config/ui/component/language");
const {getGlobalConfig} = require("../config/config");
const {printStyledTable} = require("./table-formatter");

/**
 * 用于第请求进行格式化
 */
class RequestFormatter {

    /**
     *
     * @param scriptContext {ScriptContext}
     */
    format(scriptContext) {

        const requestContext = scriptContext.requestContext;
        const language = getLanguage(getGlobalConfig().language);

        // 提示词：
        // 我需要写一些console.log的样式打印在控制台上，接下来会陆陆续续给你一些写样式的任务，球球你帮帮我

        const valueStyle = `color: black; background: #E50000; font-size: 12px; font-weight: bold;`;
        const normalStyle = `color: black; background: #FF6766; font-size: 12px;`;

        const titleStyle = 'font-weight: bold; font-size: 16px; background: green; color: white; padding: 5px; border-radius: 3px;';

        const length = 200;

        const message = [
            normalStyle, fillToLength(`-------------------------------------------------- Script Hook Captured Request --------------------------------------------------`, length) + "\n",
            normalStyle, fillToLength(`${language.console.time}: ${new Date().toLocaleString()}`, length) + "\n",
            normalStyle, fillToLength(`${language.console.requestId}: ${scriptContext.requestId}`, length) + "\n",
            normalStyle, fillToLength(`${language.console.isJsonpRequest}: ${scriptContext.isJsonp()}`, length) + "\n",
            normalStyle, fillToLength(`${language.console.hostname}: ${requestContext.hostname}`, length) + "\n",
            normalStyle, fillToLength(`${language.console.path}: ${requestContext.path}`, length) + "\n",
            normalStyle, fillToLength(`${language.console.hash}: ${requestContext.hash}`, length) + "\n",
            normalStyle, fillToLength((() => {
                const paramTitle = `${language.console.param}(${requestContext.params.length})`;
                return paramTitle;
            })(), length) + "\n",


            // (() => {
            //
            //     let paramTitle = `${indentSpace}`;
            //     if (!this.params.length) {
            //         paramTitle += " do not have param.";
            //     }
            //     msgs.push(paramTitle);
            //     for (let param of this.params) {
            //         msgs.push(param.toHumanReadable(indent + 4));
            //     }
            //
            //
            //     if (this.hash) {
            //         msgs.push()
            //     }
            //
            //     return msgs.join("\n\n");
            // })()

        ];
        console.log(genFormatArray(message), ...message);

        // 把参数以表格的形式打印
        // const data = this.convertParamsToTableData(language, requestContext.params);
        // console.table(data);

        // 示例数据
        const data = [
            // TODO 2025-01-08 01:28:26 国际化
            ["名称", "值", "备注"],
            [language.console.time, new Date().toLocaleString(), ""],
            [language.console.requestId, scriptContext.requestId, ""],
            [language.console.isJsonpRequest, scriptContext.isJsonp(), ""],
            [language.console.hostname, requestContext.hostname, ""],
            [language.console.path, requestContext.path, ""],
            [language.console.hash, requestContext.hash, ""],
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
        printStyledTable(data, styles);

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