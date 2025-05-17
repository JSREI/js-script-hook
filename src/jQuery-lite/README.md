# jQuery-lite

## 简介

这是一个超轻量级的DOM操作工具，提供类似jQuery的基本功能，同时确保所有HTML操作都符合Trusted Types安全策略。

## 主要特性

- 简单的选择器功能
- 安全的HTML操作（兼容Trusted Types）
- 轻量级DOM操作API
- 基本的样式操作

## 核心文件

- `index.ts`: 提供核心选择器功能和DOM操作方法
- `dom.ts`: 处理Trusted Types和HTML安全

## 使用方法

```typescript
import $ from './jQuery-lite';
import { initTrustedTypesPolicy } from './jQuery-lite';

// 初始化Trusted Types策略
initTrustedTypesPolicy();

// 选择器
const elements = $('.my-class');

// 设置HTML内容
elements.html('<p>安全的HTML内容</p>');

// 添加内容
elements.append('<span>更多内容</span>');

// 样式操作
elements.css('color', 'red');
elements.css({ 
  backgroundColor: 'blue',
  fontSize: '16px'
});

// 显示/隐藏
elements.show();
elements.hide();

// 查找元素
const childElements = elements.find('.child');

// DOM准备完成后执行
$.ready(() => {
  console.log('DOM已准备完成');
});
```

## 安全特性

jQuery-lite通过以下方式确保HTML操作的安全性：

1. 所有HTML字符串都通过Trusted Types策略处理
2. 拦截标准的innerHTML操作，确保安全
3. 提供备用方案处理不支持Trusted Types的浏览器
4. 详细的错误日志记录，便于调试 