const express = require('express');
const CryptoJS = require('crypto-js');
const app = express();

// 解密函数
function decryptData(encryptedData, secretKey) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

// JSONP 接口
app.get('/api', (req, res) => {
    const callbackName = req.query.callback;
    const encryptedData = req.query.data;

    // 解密数据
    const secretKey = "my-secret-key";
    const decryptedData = decryptData(encryptedData, secretKey);

    console.log("解密后的数据:", decryptedData);

    // 返回 JSONP 响应
    const responseData = { status: "success", data: decryptedData };
    res.jsonp(responseData);
});

// 启动服务器
app.listen(3000, () => {
    console.log('服务器运行在 http://localhost:3000');
});