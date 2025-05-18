import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './Installation.css';

const Installation: React.FC = () => {
  // 主安装方式切换（油猴安装 vs 源码编译安装）
  const [installMethod, setInstallMethod] = useState<'userscript' | 'source'>('userscript');
  
  // 源码编译的包管理器选择
  const [packageManager, setPackageManager] = useState<'npm' | 'yarn'>('npm');
  
  // 复制成功提示状态
  const [copySuccess, setCopySuccess] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(index);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const installationGuide = {
    npm: {
      command: 'npm install js-script-hook',
      usage: `
// 直接引入脚本即可自动开始工作
// JS Script Hook会自动拦截document.createElement
// 并为创建的script元素添加钩子

// 可以通过配置控制行为
import { getGlobalConfig } from 'js-script-hook';

// 添加调试规则
getGlobalConfig().debugRules.push({
  // 匹配URL
  urlPattern: "api.example.com/data",
  // JSONP回调参数名
  callbackFunctionName: "callback",
  // 响应匹配规则（可选）
  responsePattern: /\"id\"\\s*:\\s*\"123\"/
});

// 设置钩子实现方式
getGlobalConfig().hookType = "use-proxy-function"; // 或 "use-redeclare-function"`
    },
    yarn: {
      command: 'yarn add js-script-hook',
      usage: `
// 直接引入脚本即可自动开始工作
// JS Script Hook会自动拦截document.createElement
// 并为创建的script元素添加钩子

// 可以通过配置控制行为
import { getGlobalConfig } from 'js-script-hook';

// 添加调试规则
getGlobalConfig().debugRules.push({
  // 匹配URL
  urlPattern: "api.example.com/data",
  // JSONP回调参数名
  callbackFunctionName: "callback",
  // 响应匹配规则（可选）
  responsePattern: /\"id\"\\s*:\\s*\"123\"/
});

// 设置钩子实现方式
getGlobalConfig().hookType = "use-proxy-function"; // 或 "use-redeclare-function"`
    },
    cdn: {
      command: '<script src="https://unpkg.com/js-script-hook@latest/dist/script-hook.min.js"></script>',
      usage: `
<script>
  // JS Script Hook已自动开始工作
  // 可以通过全局配置控制行为
  
  // 添加调试规则
  ScriptHook.getGlobalConfig().debugRules.push({
    // 匹配URL
    urlPattern: "api.example.com/data",
    // JSONP回调参数名
    callbackFunctionName: "callback",
    // 响应匹配规则（可选）
    responsePattern: /\"id\"\\s*:\\s*\"123\"/
  });
  
  // 设置钩子实现方式
  ScriptHook.getGlobalConfig().hookType = "use-proxy-function"; // 或 "use-redeclare-function"
</script>`
    }
  };

  return (
    <section id="installation" className="installation">
      <div className="container">
        <div className="section-header">
          <h2>安装与使用</h2>
          <p>JS Script Hook 提供两种安装方式，选择最适合您的方式</p>
        </div>

        {/* 主安装方式选择 */}
        <div className="installation-method-tabs">
          <button 
            className={installMethod === 'userscript' ? 'active' : ''} 
            onClick={() => setInstallMethod('userscript')}
          >
            油猴脚本安装
          </button>
          <button 
            className={installMethod === 'source' ? 'active' : ''} 
            onClick={() => setInstallMethod('source')}
          >
            源码编译安装
          </button>
        </div>

        {/* 油猴脚本安装方式 */}
        {installMethod === 'userscript' && (
          <div className="userscript-installation">
            <div className="installation-steps">
              <h3>步骤 1：安装用户脚本管理器</h3>
              <p>首先，您需要在浏览器中安装一个用户脚本管理器扩展：</p>
              <ul>
                <li>
                  <a href="https://www.tampermonkey.net/" target="_blank" rel="noopener noreferrer">
                    Tampermonkey
                  </a>（推荐，支持 Chrome、Firefox、Edge、Safari 等）
                </li>
              </ul>
              
              <h3>步骤 2：安装 JS Script Hook 脚本</h3>
              <p>安装好用户脚本管理器后，点击下方按钮访问 Greasy Fork，然后点击"安装此脚本"：</p>
              
              <a 
                href="https://greasyfork.org/zh-CN/scripts/419533-js-script-hook" 
                target="_blank" 
                rel="noopener noreferrer"
                className="install-button"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M4 14a1 1 0 0 1 .3-.7l8-8a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-.7.3H5a1 1 0 0 1-1-1v-4z"></path>
                  <path d="M13 3.59l7.41 7.41a1 1 0 0 1 0 1.41l-7.41 7.41"></path>
                  <path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6"></path>
                </svg>
                前往 Greasy Fork 安装脚本
              </a>
              
              <div className="note-box">
                <h4>注意事项：</h4>
                <ul>
                  <li>安装后脚本会自动运行并开始拦截匹配规则的脚本请求</li>
                  <li>脚本已在 Chrome 87+ 版本测试通过</li>
                  <li>其他浏览器可能需要额外配置</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 源码编译安装方式 */}
        {installMethod === 'source' && (
          <div className="source-installation">
            <div className="source-tabs">
              <button 
                className={packageManager === 'npm' ? 'active' : ''} 
                onClick={() => setPackageManager('npm')}
              >
                使用 NPM
              </button>
              <button 
                className={packageManager === 'yarn' ? 'active' : ''} 
                onClick={() => setPackageManager('yarn')}
              >
                使用 Yarn
              </button>
            </div>
            
            <div className="installation-steps">
              <h3>步骤 1：克隆仓库</h3>
              <div className="code-block-container">
                <SyntaxHighlighter 
                  language="bash"
                  style={vscDarkPlus}
                  customStyle={{
                    borderRadius: '6px',
                    margin: '0',
                    padding: '15px 15px',
                    minWidth: '100%',
                    boxSizing: 'border-box',
                    overflow: 'auto',
                    backgroundColor: '#1e1e1e'
                  }}
                  wrapLines={true}
                  showLineNumbers={false}
                  codeTagProps={{
                    style: { whiteSpace: 'pre-wrap' }
                  }}
                >
                  {"git clone https://github.com/JSREI/js-script-hook.git"}
                </SyntaxHighlighter>
                <button 
                  className="copy-btn" 
                  onClick={() => handleCopy('git clone https://github.com/JSREI/js-script-hook.git', 1)}
                >
                  {copySuccess === 1 ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}>
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                      已复制
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}>
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      复制
                    </>
                  )}
                </button>
              </div>

              <h3>步骤 2：进入项目目录</h3>
              <div className="code-block-container">
                <SyntaxHighlighter 
                  language="bash"
                  style={vscDarkPlus}
                  customStyle={{
                    borderRadius: '6px',
                    margin: '0',
                    padding: '15px 15px',
                    minWidth: '100%',
                    boxSizing: 'border-box',
                    overflow: 'auto',
                    backgroundColor: '#1e1e1e'
                  }}
                  wrapLines={true}
                  showLineNumbers={false}
                  codeTagProps={{
                    style: { whiteSpace: 'pre-wrap' }
                  }}
                >
                  {"cd js-script-hook"}
                </SyntaxHighlighter>
                <button 
                  className="copy-btn" 
                  onClick={() => handleCopy('cd js-script-hook', 2)}
                >
                  {copySuccess === 2 ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}>
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                      已复制
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}>
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      复制
                    </>
                  )}
                </button>
              </div>

              <h3>步骤 3：安装依赖</h3>
              <div className="code-block-container">
                <SyntaxHighlighter 
                  language="bash"
                  style={vscDarkPlus}
                  customStyle={{
                    borderRadius: '6px',
                    margin: '0',
                    padding: '15px 15px',
                    minWidth: '100%',
                    boxSizing: 'border-box',
                    overflow: 'auto',
                    backgroundColor: '#1e1e1e'
                  }}
                  wrapLines={true}
                  showLineNumbers={false}
                  codeTagProps={{
                    style: { whiteSpace: 'pre-wrap' }
                  }}
                >
                  {packageManager === 'npm' ? "npm install" : "yarn"}
                </SyntaxHighlighter>
                <button 
                  className="copy-btn" 
                  onClick={() => handleCopy(
                    packageManager === 'npm' ? 'npm install' : 'yarn',
                    3
                  )}
                >
                  {copySuccess === 3 ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}>
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                      已复制
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}>
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      复制
                    </>
                  )}
                </button>
              </div>

              <h3>步骤 4：构建项目</h3>
              <div className="code-block-container">
                <SyntaxHighlighter 
                  language="bash"
                  style={vscDarkPlus}
                  customStyle={{
                    borderRadius: '6px',
                    margin: '0',
                    padding: '15px 15px',
                    minWidth: '100%',
                    boxSizing: 'border-box',
                    overflow: 'auto',
                    backgroundColor: '#1e1e1e'
                  }}
                  wrapLines={true}
                  showLineNumbers={false}
                  codeTagProps={{
                    style: { whiteSpace: 'pre-wrap' }
                  }}
                >
                  {packageManager === 'npm' ? 'npm run build' : 'yarn build'}
                </SyntaxHighlighter>
                <button 
                  className="copy-btn" 
                  onClick={() => handleCopy(
                    packageManager === 'npm' 
                      ? 'npm run build' 
                      : 'yarn build',
                    4
                  )}
                >
                  {copySuccess === 4 ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}>
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                      已复制
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}>
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      复制
                    </>
                  )}
                </button>
              </div>

              <h3>步骤 5：安装到油猴</h3>
              <p>构建完成后，您将在 <code>dist</code> 目录中找到 <code>script-hook.user.js</code> 文件。</p>
              <ol>
                <li>打开您的油猴扩展程序</li>
                <li>点击"添加新脚本"或"创建新脚本"</li>
                <li>将 <code>script-hook.user.js</code> 文件的内容复制粘贴到编辑器中</li>
                <li>保存脚本</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Installation; 