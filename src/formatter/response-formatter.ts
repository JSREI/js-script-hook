import { getLanguage, chinese, getLanguageByGlobalConfig } from '../config/ui/component/language';
import { fillToLength } from '../utils/string-util';
import { genFormatArray } from '../utils/log-util';
import { getGlobalConfig } from '../config/config';
import { highlightJSON } from './json-formatter';
import { getUserCodeLocation } from '../utils/code-util';
import { printStyledTable, TableStyles } from './table-formatter';
import { ScriptContext } from '../context/script/script-context';

/**
 * 用于对响应进行格式化
 */
export class ResponseFormatter {
    /**
     * 格式化响应内容
     * @param scriptContext - 脚本上下文
     */
    public format(scriptContext: ScriptContext): void {
        const codeLocation = getUserCodeLocation() || "";
        const responseContext = scriptContext.responseContext;
        const requestContext = scriptContext.requestContext;
        const language = getLanguageByGlobalConfig();

        if (!requestContext) {
            return;
        }

        const data: Array<Array<string | boolean>> = [
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

        // 示例样式
        const styles: TableStyles = {
            borderColor: '#000',
            cellBackgroundColor: '#f0f0f0',
            fontSize: '14px',
            fontColor: '#333'
        };

        // 打印表格
        const title = language.console.titleResponse;
        printStyledTable(data, styles, title);
        
        if (responseContext) {
            const msgs = highlightJSON(responseContext.jsonpCallbackArguments);
            // console.log(msgs);
        }
    }
} 