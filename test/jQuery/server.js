const http = require("http");
const url = require("url");

// 测试用的，忽略即可

http.createServer((request, response) => {
    response.writeHead(200, {"Content-Type": "application/javascript"});
    const jsonpCallbackFunctionName = url.parse(request.url, true).query.callback;
    console.log(`jsonpCallbackFunctionName = ${jsonpCallbackFunctionName}`);
    const result = {
        "foo": "blablabla",
        "bar": Math.random()
    };
    // 客户端会自动执行这个函数来处理结果
    response.end(`${jsonpCallbackFunctionName}(${JSON.stringify(result)})`);
}).listen(10010);
