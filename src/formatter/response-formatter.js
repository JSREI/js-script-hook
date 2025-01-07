const {getLanguage, chinese} = require("../config/ui/component/language");
const {fillToLength} = require("../utils/string-util");
const {genFormatArray} = require("../utils/log-util");
const {getGlobalConfig} = require("../config/config");
const {highlightJSON} = require("./json-formatter");

/**
 * 用于对响应进行格式化
 */
class ResponseFormatter {

    /**
     *
     * @param scriptContext {ScriptContext}
     */
    format(scriptContext) {

        const responseContext = scriptContext.responseContext;
        // const language = getLanguage(getGlobalConfig().language);
        const language = chinese;

        // 提示词：
        // 我需要写一些console.log的样式打印在控制台上，接下来会陆陆续续给你一些写样式的任务，球球你帮帮我

        const valueStyle = `color: black; background: #E50000; font-size: 12px; font-weight: bold;`;
        const normalStyle = `color: black; background: #FF6766; font-size: 12px;`;

        const titleStyle = 'font-weight: bold; font-size: 16px; background: green; color: white; padding: 5px; border-radius: 3px;';

        const length = 200;

        // const msgs = [];
        // msgs.push()
        // msgs.push("Time: " + new Date().toLocaleString() + "\n");
        // msgs.push(`Request ID: ${scriptContext.requestId} \n`);
        // msgs.push(`${scriptContext.responseContext.toHumanReadable(0)}`);
        // return msgs.join("\n");

        const message = [
            normalStyle, fillToLength(`-------------------------------------------------- Script Hook Captured Response --------------------------------------------------`, length) + "\n",
            normalStyle, fillToLength(`${language.console.time}: ${new Date().toLocaleString()}`, length) + "\n",
            normalStyle, fillToLength(`${language.console.requestId}: ${scriptContext.requestId}`, length) + "\n",
            // normalStyle, fillToLength(`${language.console.isJsonpRequest}: ${scriptContext.isJsonp()}`, length) + "\n",
            // normalStyle, fillToLength(`${language.console.hostname}: ${requestContext.hostname}`, length) + "\n",
            // normalStyle, fillToLength(`${language.console.path}: ${requestContext.path}`, length) + "\n",
            // normalStyle, fillToLength((() => {
            //     const paramTitle = `${language.console.param}(${requestContext.params.length})`;
            //     return paramTitle;
            // })(), length) + "\n",
            // normalStyle, fillToLength(`${language.console.hash}: ${requestContext.hash}`, length) + "\n",

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

        highlightJSON(responseContext.jsonpCallbackArguments);

    }

}

module.exports = {
    ResponseFormatter
}