# JSONP 响应解密示例

## 简介
演示前端通过 JSONP 发送明文请求，后端返回加密响应，前端解密后展示。

## 快速开始
1. **克隆项目**:
   ```bash
   git clone https://github.com/your-repo/jsonp-response-decryption-example.git
   cd jsonp-response-decryption-example
   ```

2. **启动后端**:
   ```bash
   cd backend
   npm install express crypto-js
   node server.js
   ```

3. **运行前端**:
   打开 `frontend/index.html` 文件。

## 功能
- **前端**: 发送明文请求，接收并解密加密响应。
- **后端**: 接收明文请求，返回加密的 JSONP 响应。

## 代码结构
- `frontend/index.html`: 前端页面。
- `backend/server.js`: 后端服务器。

## 示例
- **前端请求**:
  ```javascript
  jsonpRequest("http://localhost:3000/api", "handleResponse", inputData);
  ```
- **后端响应**:
  ```javascript
  res.jsonp(encryptedResponse);
  ```

---

简洁明了，适合快速了解项目！