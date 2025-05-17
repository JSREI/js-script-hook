/**
 * jQuery-lite 使用示例
 */

import $, { $safe, JQueryLite } from './index';
import { createLogger } from '../logger';

const logger = createLogger('jquery-lite-example');

// 当DOM加载完成后执行
$.ready(() => {
  // 基本选择器
  const body = $('body');
  logger.info(`找到body元素: ${body.length > 0}`);
  
  // 创建元素
  const container = $('<div class="jql-container"></div>');
  logger.info(`创建容器元素: ${container.length > 0}`);
  
  // 添加样式（将被添加到页面head中）
  const styles = $('<style type="text/css"></style>');
  styles.html(`
    .jql-container {
      padding: 20px;
      border: 2px solid #ccc;
      border-radius: 8px;
      margin: 20px;
      background-color: #f8f8f8;
    }
    .jql-item {
      margin: 10px 0;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .jql-highlight {
      background-color: #ffffcc;
    }
    .jql-btn {
      padding: 8px 12px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .jql-hide {
      display: none;
    }
  `);
  
  // 安全地创建元素
  const safeItem1 = $safe(`<div class="jql-item">
    <h3>安全创建的元素 1</h3>
    <p>这个元素使用$safe创建，完全兼容Trusted Types</p>
  </div>`);
  
  const item2 = $('<div class="jql-item"></div>');
  item2.html('<h3>基本DOM操作</h3>');
  item2.append('<p>这是通过append方法添加的内容</p>');
  
  const item3 = $('<div class="jql-item"></div>');
  item3.html('<h3>CSS操作</h3><p>点击按钮切换高亮效果</p>');
  const toggleBtn = $('<button class="jql-btn">切换高亮</button>');
  
  // 事件绑定
  toggleBtn.on('click', function() {
    item3.toggleClass('jql-highlight');
  });
  
  item3.append(toggleBtn);
  
  const item4 = $('<div class="jql-item"></div>');
  item4.html('<h3>显示/隐藏</h3><p>这个元素可以被切换显示/隐藏</p>');
  const visibilityBtn = $('<button class="jql-btn">切换可见性</button>');
  
  let visible = true;
  visibilityBtn.on('click', function() {
    if (visible) {
      item4.hide();
    } else {
      item4.show();
    }
    visible = !visible;
  });
  
  const btnContainer = $('<div style="margin-top: 10px;"></div>');
  btnContainer.append(visibilityBtn);
  item4.append(btnContainer);
  
  // 链式操作
  const item5 = $('<div></div>')
    .addClass('jql-item');
  
  // 单独调用html方法，避免类型错误
  item5.html('<h3>链式操作</h3>');
  
  // 继续链式调用
  item5.append('<p>jQuery-lite支持方法链式调用</p>')
    .attr('data-demo', 'chaining')
    .css('border-color', '#007bff');
  
  // 使用attr而不是data来获取值，避免类型错误
  logger.info(`从item5获取属性: ${item5.attr('data-demo')}`);
  
  // 组装DOM结构
  container
    .append(safeItem1)
    .append(item2)
    .append(item3)
    .append(item4)
    .append(item5);
  
  // 添加到页面
  body.append(styles);
  body.append(container);
  
  logger.info('jQuery-lite示例已加载');
  
  // 示例完成后的回调
  setTimeout(() => {
    logger.info('DOM操作示例完成');
  }, 500);
}); 