const express = require('express');
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');

const app = express();
const port = 3000;

// 加密密钥
const SECRET_KEY = 'CC11001100';

// 解密函数
function decryptData(encryptedData) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}

// 加密函数
function encryptData(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// JSONP 接口
app.get('/api/data', (req, res) => {
    const encryptedData = req.query.encryptedData;
    const decryptedData = decryptData(encryptedData);

    console.log('Received decrypted data:', decryptedData);

    // 处理数据（这里简单返回接收到的数据）
    const responseData = {message: `Hello, ${decryptedData}`};

    // 加密响应数据
    const encryptedResponse = encryptData(responseData);

    // 返回 JSONP 响应
    const callback = req.query.callback;
    res.send(`${callback}('${encryptedResponse}')`);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});