const express = require('express');
const CryptoJS = require('crypto-js');
const app = express();

// 加密函数（使用 DES）
function encryptData(data, secretKey) {
    return CryptoJS.DES.encrypt(JSON.stringify(data), secretKey).toString();
}

// JSONP 接口
app.get('/api', (req, res) => {
    const callbackName = req.query.callback;
    const requestData = req.query.data;

    console.log("接收到的请求数据:", requestData);

    // 模拟响应数据
    const responseData = {
        status: "success",
        message: "请求成功！",
        requestData: requestData
    };

    // 加密响应数据
    const secretKey = "my-secret-key"; // 加密密钥（需要与前端一致）
    const encryptedResponse = encryptData(responseData, secretKey);

    // 返回 JSONP 响应
    res.jsonp(encryptedResponse);
});

// 启动服务器
app.listen(3000, () => {
    console.log('服务器运行在 http://localhost:3000');
});