/**
 * 用于对响应进行格式化
 */
class ResponseFormatter {

    /**
     *
     * @param scriptContext {ScriptContext}
     */
    format(scriptContext) {
        const msgs = [];
        msgs.push(`-------------------------------------------------- Script Hook Captured Response --------------------------------------------------`)
        msgs.push("Time: " + new Date().toLocaleString() + "\n");
        msgs.push(`Request ID: ${scriptContext.requestId} \n`);
        msgs.push(`${scriptContext.responseContext.toHumanReadable(0)}`);
        return msgs.join("\n");
    }

}

module.exports = {
    ResponseFormatter
}