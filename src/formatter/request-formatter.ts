import { getLanguageByGlobalConfig } from '../config/ui/component/language';
import { getGlobalConfig } from '../config/config';
import { printStyledTable, TableStyles } from './table-formatter';
import { getUserCodeLocation } from '../utils/code-util';
import { ScriptContext } from '../context/script/script-context';
import { Param } from '../context/request/param';

interface Language {
    console: {
        tableKey: string;
        tableValue: string;
        tableComment: string;
        time: string;
        requestId: string;
        isJsonpRequest: string;
        hostname: string;
        path: string;
        hash: string;
        codeLocation: string;
        param: string;
        paramName: string;
        paramValue: string;
        isJsonpCallback: string;
        titleRequest: string;
    };
}

/**
 * 用于对请求进行格式化
 */
export class RequestFormatter {

    /**
     * 格式化请求上下文
     * @param scriptContext - 脚本上下文对象
     */
    public format(scriptContext: ScriptContext): void {
        const codeLocation = getUserCodeLocation();
        const requestContext = scriptContext.requestContext;
        if (!requestContext) {
            return;
        }

        const language = getLanguageByGlobalConfig();

        const data: (string | boolean)[][] = [
            // TODO 2025-01-08 01:28:26 国际化
            [language.console.tableKey, language.console.tableValue, language.console.tableComment],
            [language.console.time, new Date().toLocaleString(), ""],
            [language.console.requestId, scriptContext.requestId, ""],
            [language.console.isJsonpRequest, String(scriptContext.isJsonp()), ""],
            [language.console.hostname, requestContext.hostname, ""],
            [language.console.path, requestContext.path, ""],
            [language.console.hash, requestContext.hash || "", ""],
            [language.console.codeLocation, codeLocation || "", ""],
            // [language.console.param, String(requestContext.params.length)],
        ];

        let index = 1;
        for (const param of requestContext.params) {
            const name = `${language.console.param}(${index++}) ${param.name}`;
            const value = `${param.value}`;

            let attribute = "";
            if (param.isJsonpCallback) {
                attribute = "jsonp callback";
            } else if (param.encryptType) {
                attribute = param.encryptType;
            }

            data.push([name, value, attribute]);
        }

        // 示例样式
        const styles: TableStyles = {
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
     * 将参数转换为表格数据
     * @param language - 语言配置对象
     * @param params - 参数数组
     * @returns 返回表格数据数组
     */
    private convertParamsToTableData(language: Language, params: Param[]): Record<string, string | boolean>[] {
        const tableData: Record<string, string | boolean>[] = [];
        for (const param of params) {
            const o: Record<string, string | boolean> = {};
            o[language.console.paramName] = param.name;
            o[language.console.paramValue] = param.value;
            o[language.console.isJsonpCallback] = param.isJsonpCallback;
            tableData.push(o);
        }
        return tableData;
    }
} 