import React, { useState } from 'react';
import './Installation.css';

const Installation: React.FC = () => {
  // 主安装方式切换（油猴安装 vs 源码编译安装）
  const [installMethod, setInstallMethod] = useState<'userscript' | 'source'>('userscript');
  
  // 源码编译的包管理器选择
  const [packageManager, setPackageManager] = useState<'npm' | 'yarn'>('npm');

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
              <p>首先，您需要在浏览器中安装一个用户脚本管理器扩展，如：</p>
              <ul>
                <li>
                  <a href="https://www.tampermonkey.net/" target="_blank" rel="noopener noreferrer">
                    Tampermonkey
                  </a>（推荐，支持 Chrome、Firefox、Edge、Safari 等）
                </li>
                <li>
                  <a href="https://violentmonkey.github.io/" target="_blank" rel="noopener noreferrer">
                    Violentmonkey
                  </a>
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
              <div className="command-container">
                <pre>
                  <code>git clone https://github.com/JSREI/js-script-hook.git</code>
                </pre>
                <button 
                  className="copy-btn" 
                  onClick={() => navigator.clipboard.writeText('git clone https://github.com/JSREI/js-script-hook.git')}
                >
                  复制
                </button>
              </div>

              <h3>步骤 2：安装依赖</h3>
              <div className="command-container">
                <pre>
                  <code>
                    {packageManager === 'npm' 
                      ? 'cd js-script-hook\nnpm install' 
                      : 'cd js-script-hook\nyarn'}
                  </code>
                </pre>
                <button 
                  className="copy-btn" 
                  onClick={() => navigator.clipboard.writeText(
                    packageManager === 'npm' 
                      ? 'cd js-script-hook\nnpm install' 
                      : 'cd js-script-hook\nyarn'
                  )}
                >
                  复制
                </button>
              </div>

              <h3>步骤 3：构建项目</h3>
              <div className="command-container">
                <pre>
                  <code>
                    {packageManager === 'npm' 
                      ? 'npm run build' 
                      : 'yarn build'}
                  </code>
                </pre>
                <button 
                  className="copy-btn" 
                  onClick={() => navigator.clipboard.writeText(
                    packageManager === 'npm' 
                      ? 'npm run build' 
                      : 'yarn build'
                  )}
                >
                  复制
                </button>
              </div>

              <h3>步骤 4：安装到油猴</h3>
              <p>构建完成后，您将在 <code>dist</code> 目录中找到 <code>script-hook.user.js</code> 文件。</p>
              <ol>
                <li>打开您的油猴扩展程序</li>
                <li>点击"添加新脚本"或"创建新脚本"</li>
                <li>将 <code>script-hook.user.js</code> 文件的内容复制粘贴到编辑器中</li>
                <li>保存脚本</li>
              </ol>

              <div className="note-box">
                <h4>高级配置：</h4>
                <p>您可以在源码中修改 <code>src/config/config.ts</code> 文件来自定义默认配置。</p>
                <p>构建后，还可以在浏览器控制台中使用 <code>getGlobalConfig()</code> 函数来动态调整配置。</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Installation; 