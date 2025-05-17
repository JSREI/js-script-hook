# jQuery-lite

轻量级jQuery替代库，专为JSREI项目设计，支持Trusted Types安全策略。

## 特点

- 轻量级：只包含jQuery核心功能
- 安全：与Trusted Types兼容
- 现代：使用现代JavaScript和DOM API
- TypeScript友好：完整的类型定义

## 模块结构

- `index.ts`: 主入口，导出`$`和`$safe`函数
- `core.ts`: DOM元素集合类实现
- `dom.ts`: DOM操作相关工具函数
- `types.ts`: 类型定义
- `utils.ts`: 工具函数

## 基本用法

```typescript
import $ from '../jQuery-lite';

// 选择器
const elements = $('.my-class');
const divs = $('div');

// 创建元素
const button = $('<button>点击我</button>');

// DOM操作
$('.container').append(button);
$('.old-element').remove();

// CSS操作
$('p').addClass('highlighted');
$('.box').css('color', 'blue');

// 事件
$('.button').on('click', () => {
  console.log('按钮被点击');
});

// 安全创建元素 (Trusted Types安全)
import { $safe } from '../jQuery-lite';
const safeElement = $safe('<div class="safe">安全的HTML内容</div>');
```

## 支持的方法

### 选择器
- `find(selector)`: 查找后代元素
- `filter(predicate)`: 过滤元素集合
- `parent()`: 获取父元素
- `children()`: 获取子元素
- `closest(selector)`: 查找最近的匹配祖先

### DOM操作
- `append(content)`: 追加内容
- `prepend(content)`: 前置内容
- `before(content)`: 在元素前插入内容
- `after(content)`: 在元素后插入内容
- `remove()`: 移除元素
- `empty()`: 清空元素内容
- `html(content?)`: 获取/设置HTML
- `text(content?)`: 获取/设置文本

### 属性操作
- `attr(name, value?)`: 获取/设置属性
- `removeAttr(name)`: 删除属性
- `data(key, value?)`: 获取/设置数据

### CSS操作
- `addClass(className)`: 添加类
- `removeClass(className)`: 移除类
- `toggleClass(className)`: 切换类
- `hasClass(className)`: 检查是否有类
- `css(property, value?)`: 获取/设置样式
- `show()`: 显示元素
- `hide()`: 隐藏元素

### 事件处理
- `on(event, handler)`: 绑定事件
- `off(event, handler?)`: 解绑事件
- `click(handler?)`: 点击事件

### 遍历
- `each(callback)`: 遍历元素
- `get(index?)`: 获取原始元素
- `eq(index)`: 获取指定索引的元素
- `first()`: 获取第一个元素
- `last()`: 获取最后一个元素 