/**
 * 用于第请求进行格式化
 */
class RequestFormatter {

    /**
     *
     * @param scriptContext {ScriptContext}
     */
    format(scriptContext) {
        const msgs = [];
        msgs.push(`-------------------------------------------------- Script Hook Captured Request --------------------------------------------------`)
        msgs.push("Time: " + new Date().toLocaleString() + "\n");
        msgs.push(`Request ID: ${scriptContext.requestId} \n`)
        msgs.push(`Is jsonp request: ${scriptContext.isJsonp()} \n`)
        msgs.push(`${scriptContext.requestContext.toHumanReadable(0)}`)
        return msgs.join("\n");
    }

}

module.exports = {
    RequestFormatter
}