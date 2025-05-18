import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>JS Script Hook</h4>
            <p>强大的JavaScript函数拦截与钩子工具，让您完全控制函数执行流程。</p>
          </div>
          
          <div className="footer-section">
            <h4>链接</h4>
            <ul>
              <li><a href="https://github.com/JSREI/js-script-hook" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="https://github.com/JSREI/js-script-hook/issues" target="_blank" rel="noopener noreferrer">问题反馈</a></li>
              <li><a href="https://github.com/JSREI/js-script-hook/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">许可协议</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>资源</h4>
            <ul>
              <li><a href="#installation">安装指南</a></li>
              <li><a href="#examples">示例代码</a></li>
              <li><a href="https://github.com/JSREI/js-script-hook#readme" target="_blank" rel="noopener noreferrer">文档</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} JS Script Hook. 保留所有权利。</p>
          <p>由 <a href="https://github.com/JSREI" target="_blank" rel="noopener noreferrer">JSREI</a> 团队开发</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 